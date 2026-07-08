// ------------------------------------ Global Variables ------------------------------------ //

const tableName = "view_campaign_split";

const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const version = getAllVersions();


version.forEach(version => {

// ----------------------------------- Version Variables ------------------------------------ //

  const isPublish = constant(version, tableName.toUpperCase());
  const domain = constant(version, "DOMAIN");
  const currency = constant(version, "CURRENCY");
  const ga4ID = constant(version, "GA4");
  const hasGA4Arc = !!constant(version, "GA4_ARCHIVE");
  const hasUAArc  = !!constant(version, "UA_ARCHIVE");
  const costDate = `
    (SELECT
     PARSE_DATE("%Y%m%d",SPLIT(table_id, '_')[OFFSET(1)]) as table_id,
    FROM
     \`${project_id}.analytics_${ga4ID}.__TABLES__\`
    WHERE
      table_id not like "%intraday%" AND
      table_id like "events%"
    ORDER BY
      1 desc
    LIMIT
      1)
  `;
  
// -------------------------------------- Input Tables -------------------------------------- //

  const uaArchiveTable = project_id + ".ga_data_staging_" + domain + ".in_ua_archive";
  const ga4ArchiveTable = project_id + ".ga_data_staging_" + domain + ".view_ga4_archive_" + domain;
  const sessionTableFull = project_id + ".analytics_" + ga4ID + ".out_sessions_" + domain;
  const sessionPurchaseTable = "out_sessions_purchase_" + domain;
  const costTable = "view_costs_" + domain;

// UA archive CTE (sjednocené aliasy -> lowercase)
  const uaArchiveCte = hasUAArc ? `
    ci_archive AS (
      SELECT
        Date AS date,
        Source AS source,
        Medium AS medium,
        Campaign AS campaign,
        NULL AS avg_session_length,
        NULL AS session_engaged,
        Users AS users,
        NULL AS new_users,
        Sessions AS sessions,
        Transactions AS transactions,
        Revenue AS revenue,
        Revenue AS revenue_czk
      FROM ${uaArchiveTable}
    ),` : ``;

  // GA4 archive CTE – **pozor: používá _aktuální_ domain**
  const ga4ArchiveCte = hasGA4Arc ? `
    ga4_archive AS (
      SELECT * FROM \`${ga4ArchiveTable}\`
    ),` : ``;

  // -------------------------------- Hraniční logika mezi archivy a live sessions -------------------------------- //

  // hranice live dat
  const ga4FirstLiveDate = `(SELECT MIN(date) FROM \`${sessionTableFull}\`)`;

  // hranice archivu
  const ga4ArchiveMin = hasGA4Arc ? `(SELECT MIN(date) FROM \`${ga4ArchiveTable}\`)` : null;

  // hranice UA archivu
  const uaArchiveMin = hasUAArc ? `(SELECT MIN(date) FROM \`${uaArchiveTable}\`)` : null;

  // UA archiv: data před GA4 archivem
  const uaDatePart = hasUAArc && hasGA4Arc
    ? `SELECT * FROM ci_archive WHERE date < ${ga4ArchiveMin} UNION ALL`
    : hasUAArc && !hasGA4Arc
      ? `SELECT * FROM ci_archive WHERE date < ${ga4FirstLiveDate} UNION ALL`
      : ``;

  // GA4 archiv: data před začátkem live sessions
  const ga4DatePart = hasGA4Arc
    ? `SELECT * FROM ga4_archive WHERE date < ${ga4FirstLiveDate} UNION ALL`
    : ``;

  // Živá data: vždy celá, hlavní zdroj
  const runningDatePart = `SELECT * FROM ga4_dimensions`;
      
// ---------------------------------------- SQL Code ---------------------------------------- //

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
    WITH 
    ${uaArchiveCte}
    ${ga4ArchiveCte}
    
    ga4_dimensions AS (
      SELECT
        date AS date,
        source AS source, 
        medium AS medium,
        ${campaignRename(domain,"t1.campaign")} AS campaign,
        avg(session_length_seconds) AS avg_session_length,
        countif(session_engaged = 1) / count(ifnull(session_engaged,0)) AS session_engaged,
        count(distinct user_pseudo_id) AS users,
        sum(new_users) AS new_users,
        count(distinct session_id) AS sessions,
        sum(transactions) AS transactions,
        sum(revenue) AS revenue,
        sum(revenue_czk) AS revenue_czk
      FROM
        ${ctx.ref(sessionPurchaseTable)} t1
      GROUP BY
        1,2,3,4
    ),

    ga_union AS (
      ${uaDatePart}
      ${ga4DatePart}
      ${runningDatePart}
    ),

    ga4_cost AS (
      SELECT
        COALESCE(t1.date,t2.date) AS date,
        COALESCE(t1.source,t2.source) AS source,
        COALESCE(t1.medium,t2.medium) AS medium,
        COALESCE(t1.campaign,t2.campaign) AS campaign,
        t2.impressions,
        t2.clicks,
        t2.Cost,
        t1.avg_session_length,
        t1.session_engaged,
        IFNULL(t1.users,1) AS users,
        t1.new_users,
        IFNULL(t1.sessions,1) AS sessions,
        t1.transactions,
        t1.revenue,
        t1.revenue_czk
      FROM
        ga_union t1
      FULL OUTER JOIN 
        (SELECT * FROM ${ctx.ref(costTable)} WHERE date <= ${costDate}) t2
      ON 
        t1.date = t2.date 
        AND t1.Source = t2.source 
        AND t1.Medium = t2.medium 
        AND t1.Campaign = t2.campaign
    ),

    active_campaigns as (
    SELECT DISTINCT
      source,
      medium,
      campaign
    FROM
      ${ctx.ref(costTable)}
    WHERE
      Cost > 0 AND
      date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
    )

    SELECT
      "${domain}" AS market,
      ${conversionRate("t1.date",currency)} AS exchange_rate,
      t1.date,	
      EXTRACT(YEAR FROM t1.date) AS year,
      EXTRACT(MONTH FROM t1.date) AS month,
      format_date('%Y%m',t1.date) AS month_of_year,
      ${dayOfWeek("t1.date")} AS day_of_week,
      ${thirdOfMonth("t1.date")} AS third_of_month,
      t1.source, 
      t1.medium,
      ${sourceMedium("t1.source","t1.medium","t1.campaign")} AS source_medium,
      t1.campaign AS campaign,
      ${campaign("t1.source","t1.medium","t1.campaign")} AS campaign_name,
      ${sourceName("t1.source","t1.medium","t1.campaign")} AS source_name,
      ${sourceType("t1.source","t1.medium","t1.campaign")} AS source_type,
      ${channelType("t1.source","t1.medium","t1.campaign")} AS channel_type,
      ${isBrand("t1.source","t1.medium","t1.campaign")} AS is_brand,
      ${campaignType("t1.campaign")} AS campaign_type,
      CASE WHEN t2.campaign IS NULL THEN false ELSE true END as active_campaign,
      sum(t1.Impressions) AS impressions, 	  
      sum(t1.Clicks) AS clicks,
      sum(t1.cost) AS cost,
      sum(
        CASE 
          WHEN "${version}" = "de" AND t1.source LIKE "%facebook%" THEN  t1.cost * ${conversionRate("t1.date","CZK")}
          ELSE t1.cost * ${conversionRate("t1.date",currency)}
        END
        ) AS cost_czk,
      (sum(t1.cost * ${conversionRate("t1.date",currency)})) / min(${monthStatus("t1.date")}) AS predicted_cost_czk,
      avg(t1.avg_session_length) / 60 AS avg_session_length,
      avg(t1.session_engaged) AS session_engaged,
      sum(t1.Users) AS users,
      sum(t1.new_users) AS new_users,	
      sum(t1.Sessions) AS sessions,
      sum(t1.transactions) AS transactions,	
      sum(t1.transactions) / min(${monthStatus("t1.date")}) AS predicted_transactions,
      sum(t1.revenue) AS revenue,	
      sum(t1.revenue_czk) AS revenue_czk,
      (sum(t1.revenue_czk)) / min(${monthStatus("t1.date")}) AS predicted_revenue_czk,
      min(${monthStatus("t1.date")}) AS month_status,
      min(${yearStatus()}) AS year_status
    FROM
      ga4_cost t1
    LEFT JOIN
      active_campaigns t2
    ON
      t1.source = t2.source AND
      t1.medium = t2.medium AND
      t1.campaign = t2.campaign
    GROUP BY
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19

  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags([`${domain}`, "view", "campaign_split"]);
}
});