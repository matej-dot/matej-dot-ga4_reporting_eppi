/*
 * Zdroj relácie — doplnky k balíku dataform-ga4-sessions.
 *
 * Balík berie zdroj z parametrov source / medium / campaign / gclid, ktoré GA4 pripojí k eventom.
 * Tri situácie, v ktorých to nestačí:
 *
 * 1. GA4 parametre nedodá, hoci návšteva zdroj má. Stáva sa to, keď sa prvý hit relácie nedoručí
 *    (3. 3.–23. 9. 2026 na výpisoch: view_item_list nad 16 KB) — ďalšie eventy relácie parametre
 *    zdroja nenesú. Zdroj sa vtedy číta z URL prvej stránky (gclid, UTM) a z referrera.
 * 2. Návrat z platobnej brány GA4 hlási ako nový zdroj (gate.gopay.com / referral). Brána nie je
 *    zdroj návštevy: relácia bez iného zdroja ostáva direct a dedí posledný nepriamy zdroj.
 * 3. Posledný nepriamy zdroj sa hľadá 30 dní dozadu, no inkrementálny beh čítal len 30 dní
 *    eventov — riadok sa pri poslednom prepočte (keď opúšťal okno) pozeral do prázdna.
 */

// Platobné brány — rovnaký zoznam ako „List unwanted referrals" v Google tagu G-137V330KKC
const PAYMENT_GATEWAYS = "(?:^|\\.)(?:gopay\\.com|gopay\\.cz|gpwebpay\\.com|tatrabanka\\.sk|klarna\\.com)$";

// Vyhľadávače tak, ako ich pomenúva GA4: [regex nad hostom referrera, source]
const SEARCH_ENGINES = [
  ["^(?:www\\.)?google\\.[a-z]{2,3}(?:\\.[a-z]{2})?$", "google"],
  ["^search\\.seznam\\.cz$", "seznam"],
  ["^(?:www\\.|cn\\.)?bing\\.com$", "bing"],
  ["^duckduckgo\\.com$", "duckduckgo"],
  ["^(?:r\\.)?search\\.yahoo\\.com$", "yahoo"],
  ["^search\\.centrum\\.cz$", "centrum.cz"],
  ["^www\\.ecosia\\.org$", "ecosia.org"],
  ["^www\\.qwant\\.com$", "qwant.com"],
];

const searchEngineRegex = SEARCH_ENGINES.map(([regex]) => regex).join("|");
const searchEngineSource = `CASE ${SEARCH_ENGINES.map(
  ([regex, source]) => `WHEN REGEXP_CONTAINS(session_referrer, r'${regex}') THEN '${source}'`
).join(" ")} END`;

const decodeOnce = (expr, alias) => `(SELECT STRING_AGG(IF(REGEXP_CONTAINS(${alias}, r'^(?:%[0-9a-fA-F]{2})+$'), SAFE_CONVERT_BYTES_TO_STRING(FROM_HEX(REPLACE(${alias}, '%', ''))), ${alias}), '' ORDER BY ${alias}_offset) FROM UNNEST(REGEXP_EXTRACT_ALL(${expr}, r'(?:%[0-9a-fA-F]{2})+|[^%]+|%')) AS ${alias} WITH OFFSET ${alias}_offset)`;

// Hodnota parametra z URL prvej stránky v tvare, v akom ju zapisuje GA4: percent-dekódovaná
// dvakrát (Meta posiela %252F), viacnásobné medzery zlúčené, „+" ostáva plusom.
const urlParam = (name) => `NULLIF(TRIM(REGEXP_REPLACE(${decodeOnce(
  decodeOnce(`REGEXP_EXTRACT(landing_page, r'[?&]${name}=([^&#]*)')`, "p1"),
  "p2"
)}, r'\\s+', ' ')), '')`;

// Poradie rozhoduje: platí prvé pravidlo, ktoré sa splní.
const sourceMediumRules = [
  // GA4 dodalo gclid (pôvodné pravidlo balíka)
  {
    columns: ["gclid"],
    conditionType: "NOT_NULL",
    conditionValue: "",
    value: { source: "'google'", medium: "'cpc'", campaign: "campaign" },
  },
  // GA4 dodalo source / medium / campaign (pôvodné pravidlo balíka)
  {
    columns: ["source", "medium", "campaign"],
    conditionType: "NOT_NULL",
    conditionValue: "",
    value: { source: "source", medium: "medium", campaign: "campaign" },
  },
  // GA4 nedodalo nič, URL prvej stránky nesie identifikátor kliku Google Ads
  {
    columns: ["landing_page"],
    conditionType: "REGEXP_CONTAINS",
    conditionValue: "[?&](?:gclid|gbraid|wbraid)=[^&#]",
    value: { source: "'google'", medium: "'cpc'", campaign: urlParam("utm_campaign") },
  },
  // GA4 nedodalo nič, URL prvej stránky nesie UTM
  {
    columns: ["landing_page"],
    conditionType: "REGEXP_CONTAINS",
    conditionValue: "[?&]utm_source=[^&#]",
    value: {
      source: `IFNULL(${urlParam("utm_source")}, '(not set)')`,
      medium: `COALESCE(${urlParam("utm_medium")}, IF(session_referrer IS NOT NULL, 'referral', '(not set)'))`,
      campaign: `COALESCE(${urlParam("utm_campaign")}, CASE WHEN REGEXP_CONTAINS(session_referrer, r'${searchEngineRegex}') THEN '(organic)' WHEN session_referrer IS NOT NULL THEN '(referral)' ELSE '(not set)' END)`,
    },
  },
  // Referrer je vyhľadávač → organic, nie referral
  {
    columns: ["session_referrer"],
    conditionType: "REGEXP_CONTAINS",
    conditionValue: searchEngineRegex,
    value: { source: searchEngineSource, medium: "'organic'", campaign: "'(organic)'" },
  },
  // Iný referrer (pôvodné pravidlo balíka)
  {
    columns: ["session_referrer"],
    conditionType: "NOT_NULL",
    conditionValue: "",
    value: { source: "session_referrer", medium: "'referral'", campaign: "'not set'" },
  },
];

const isGatewaySource = `(medium = 'referral' AND REGEXP_CONTAINS(source, r'${PAYMENT_GATEWAYS}'))`;

const eventsWithoutGateways = {
  queryName: "events_without_gateways",
  query: () => `events_without_gateways as (
        select * replace (
          IF(${isGatewaySource}, NULL, source) as source,
          IF(${isGatewaySource}, NULL, medium) as medium,
          IF(${isGatewaySource}, NULL, campaign) as campaign,
          IF(REGEXP_CONTAINS(NET.HOST(LOWER(page_referrer)), r'${PAYMENT_GATEWAYS}'), NULL, page_referrer) as page_referrer
        )
        from events
      )`,
};

/*
 * Kroky balíka + dva vlastné:
 * - pred sessions_base sa z eventov odstráni zdroj „platobná brána",
 * - za posledným krokom sa pri inkrementálnom behu nechajú len relácie z okna, ktoré sa prepisuje.
 *   Eventy sa čítajú o lookback dlhšie (viď ga4_sessions.js); bez tohto filtra by MERGE staršie
 *   relácie vložil druhýkrát.
 */
function processingSteps(defaultSteps, updateWindowDays) {
  const lastStep = defaultSteps[defaultSteps.length - 1].queryName;

  const steps = defaultSteps.map((step) => {
    if (step.queryName !== "sessions_base") return step;
    return {
      queryName: step.queryName,
      query: (session, ctx) => {
        const sql = step.query(session, ctx);
        if ((sql.match(/\bfrom events\b/g) || []).length !== 1) {
          throw new Error("sessions_base: čakám práve jedno `from events` — zmenil sa balík dataform-ga4-sessions?");
        }
        return sql.replace(/\bfrom events\b/, "from events_without_gateways");
      },
    };
  });

  const sessionsInUpdateWindow = {
    queryName: "sessions_in_update_window",
    query: (session, ctx) => `sessions_in_update_window as (
        select * from ${lastStep}
        ${ctx.when(ctx.incremental(), `where date >= date_sub(current_date(), interval ${updateWindowDays} day)`)}
      )`,
  };

  return [eventsWithoutGateways, ...steps, sessionsInUpdateWindow];
}

module.exports = {
  sourceMediumRules,
  processingSteps,
};
