
const tableName = "view_ecommerce_events";

// ------------------------------------------------------------------------------------------ //

const { getAllVersions } = require('includes/constants');
const version = getAllVersions();


version.forEach(version => {

  const { constant } = require('includes/constants');
  const isPublish = constant(version, tableName.toUpperCase());

  if (isPublish) { 
  
  const { project_id } = require('includes/constants');
  const domain = constant(version, "DOMAIN");
  const ga4 = constant(version, "GA4");
  const currency = constant(version, "CURRENCY");

// -------------------------------------- Input Tables -------------------------------------- //

  const outEvents = "`" + project_id + ".analytics_" + ga4 + ".out_events_" + domain + "`";
  const outSessions = "out_sessions_purchase_" + domain;
  const ga4ArchiveTable = "`" + project_id + ".analytics_" + ga4 + ".in_ga4_archive_products`";
  const liveGA = "`" + project_id + ".analytics_" + ga4 + ".events_*`";

// --------------------------------- GA4 Archive Conditions ---------------------------------- //
const ga4From = `(SELECT MIN(PARSE_DATE("%Y%m%d", _table_suffix))
                  FROM ${liveGA}
                  WHERE _table_suffix NOT LIKE "%intraday%")`;

const ga4_date_query = `
  ga4_archive AS (
    SELECT
      t1.date,
      sessionSource AS source,
      sessionMedium AS medium,
      sessionCampaignName AS campaign,
      CONCAT(sessionSource, " / ", sessionMedium) AS source_medium,
      "purchase" AS event_name,
      itemId AS item_id,
      itemName AS item_name,
      itemCategory AS item_category,
      SUM(itemsPurchased) AS quantity,
      SUM(itemRevenue) AS item_revenue,
      SUM(t1.itemRevenue * ${conversionRate("t1.date", currency)}) AS item_revenue_czk,
      COUNT(*) AS event_count
    FROM (SELECT * FROM ${ga4ArchiveTable}) t1
    WHERE t1.date < ${ga4From}
    GROUP BY 1,2,3,4,5,6,7,8,9
  ),

  source_merging AS (
    SELECT * FROM sources
    UNION ALL
    SELECT * FROM ga4_archive
  )
`;

const ga4SourceArchive =
  constant(version, "GA4_ARCHIVE")
    ? ga4_date_query
    : `
      source_merging AS (
        SELECT * FROM sources
      )
    `;

publish(tableName + "_" + domain).query(
  ctx => `
    WITH
    events_unioning as (
    SELECT date, concat(user_pseudo_id,session_id) as session_id, "view_item" as event_name, item_id, item_name, item_category, null as quantity, null as item_revenue, null as item_revenue_czk, count(*) as event_count FROM (SELECT * FROM ${outEvents},UNNEST (items) WHERE event_name = "view_item" ) GROUP BY 1,2,3,4,5,6

      UNION ALL

    SELECT date, concat(user_pseudo_id,session_id) as session_id, "add_to_cart" as event_name, item_id, item_name, item_category, null as quantity, null as item_revenue, null as item_revenue_czk, count(*) as event_count FROM (SELECT * FROM ${outEvents},UNNEST (items) WHERE event_name = "add_to_cart" ) GROUP BY 1,2,3,4,5,6

      UNION ALL   

    SELECT date, concat(user_pseudo_id,session_id) as session_id, "remove_from_cart" as event_name, item_id, item_name, item_category, null as quantity, null as item_revenue, null as item_revenue_czk, count(*) as event_count FROM (SELECT * FROM ${outEvents},UNNEST (items) WHERE event_name = "remove_from_cart" ) GROUP BY 1,2,3,4,5,6

      UNION ALL 

    SELECT date, concat(user_pseudo_id,session_id) as session_id, "begin_checkout" as event_name, item_id, item_name, item_category, null as quantity, null as item_revenue, null as item_revenue_czk, count(*) as event_count FROM (SELECT * FROM ${outEvents},UNNEST (items) WHERE event_name = "begin_checkout" ) GROUP BY 1,2,3,4,5,6

      UNION ALL 

    SELECT date, concat(user_pseudo_id,session_id) as session_id, "view_cart" as event_name, item_id, item_name, item_category, null as quantity, null as item_revenue, null as item_revenue_czk, count(*) as event_count FROM (SELECT * FROM ${outEvents},UNNEST (items) WHERE event_name = "view_cart" ) GROUP BY 1,2,3,4,5,6

      UNION ALL 

    SELECT 
      t1.date, 
      concat(t1.user_pseudo_id,t1.session_id) as session_id, 
      "purchase" as event_name, 
      t1.item_id, 
      t1.item_name, 
      t1.item_category, 
      SUM(t1.quantity) as quantity, 
      SUM(t1.item_revenue) as item_revenue,
      SUM(t1.item_revenue * (1 / IFNULL(t2.rate,t3.rate))) as item_revenue_czk,
      count(*) as event_count
    FROM 
      (SELECT * FROM ${outEvents} LEFT JOIN UNNEST (items) WHERE event_name = "purchase" ) t1
    LEFT JOIN
      \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` t2
    ON
      t1.date = PARSE_DATE("%Y-%m-%d",t2.date) AND
      (SELECT value.string_value FROM UNNEST (event_params) WHERE key = "currency") = t2.code
    LEFT JOIN
      (SELECT code,rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE PARSE_DATE("%Y-%m-%d",date) = (SELECT MIN(PARSE_DATE("%Y-%m-%d",date)) FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\`)) t3
    ON
      (SELECT value.string_value FROM UNNEST (event_params) WHERE key = "currency") = t3.code
    GROUP BY 1,2,3,4,5,6

    ),

    dimensions as (
      SELECT
        t1.date,
        t1.session_id,
        t1.event_name,
        t1.item_id,
        t1.item_name,
        t1.item_category,
        t1.quantity,
        t1.item_revenue,
        t1.item_revenue_czk,
        t1.event_count
      FROM
        events_unioning t1
    ),

    sources as (
      SELECT
        t1.date,
        t2.source,
        t2.medium,
        t2.campaign,
        CONCAT(t2.source," / ",t2.medium) as source_medium,
        t1.event_name,
        t1.item_id,
        t1.item_name,
        t1.item_category,
        SUM(t1.quantity) as quantity,
        SUM(t1.item_revenue) as item_revenue,
        SUM(t1.item_revenue_czk) as item_revenue_czk,
        SUM(t1.event_count) as event_count
      FROM
        dimensions t1
      LEFT JOIN
        (SELECT * FROM ${ctx.ref(outSessions)} ) t2
      ON
        t1.date = t2.date AND
        t1.session_id = t2.session_id
      GROUP BY
        1,2,3,4,5,6,7,8,9
    ),

    ${ga4SourceArchive}

    SELECT
        "${domain}" as market,
        date,
        source,
        medium,
        campaign,
        ${sourceName("source","medium","campaign")} as source_name,
        ${sourceType("source","medium","campaign")} as source_type,
        item_id,
        item_name,
        item_category,
        sum(CASE WHEN event_name = "view_item" THEN event_count ELSE 0 END) as view_item,
        sum(CASE WHEN event_name = "add_to_cart" THEN event_count ELSE 0 END) as add_to_cart,
        sum(CASE WHEN event_name = "remove_from_cart" THEN event_count ELSE 0 END) as remove_from_cart,
        sum(CASE WHEN event_name = "begin_checkout" THEN event_count ELSE 0 END) as begin_checkout,
        sum(CASE WHEN event_name = "view_cart" THEN event_count ELSE 0 END) as view_cart,
        sum(CASE WHEN event_name = "purchase" THEN event_count ELSE 0 END) as purchase,
        sum(quantity) as item_quantity,
        sum(item_revenue) as item_revenue,
        sum(item_revenue_czk) as item_revenue_czk
    FROM
      source_merging
    GROUP BY
      1,2,3,4,5,6,7,8,9,10
  `
)
.type("incremental")
.schema("ga_data_staging_" + `${domain}`)
.tags([`${domain}`,"incremental_table", "ecommerce_events",`analytics_${ga4}`])
.dependencies(["out_events_" + `${domain}`,"out_purchase_" + `${domain}`])

;
}
});