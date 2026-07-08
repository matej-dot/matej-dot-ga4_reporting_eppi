
const tableName = "out_sessions_purchase";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const version = getAllVersions();

version.forEach(version => {

  const isPublish = constant(version, "view_campaign_split".toUpperCase() );
  const domain = constant(version, "DOMAIN");
  const adsID = constant(version, "ADS");
  const market = constant(version, "DOMAIN").split("_").pop();
  
  // Tables

  const sessionTable = "out_sessions_" + domain;
  const purchaseTable = "out_purchase_" + domain;
  const adsClickStats = project_id + ".gads_" + version + "_" + adsID + ".p_ads_ClickStats_" + adsID;
  const adsCampaign = project_id + ".gads_" + version + "_" + adsID + ".p_ads_Campaign_" + adsID;
  const inSheetExcludedOrders = project_id + ".input_data.in_sheet_excluded_orders";

// Excluded orders

let ordersExcluding;

if (constant(version, "EX_ORDERS")) {ordersExcluding = `LEFT JOIN (SELECT * FROM ${inSheetExcludedOrders} WHERE mutation = "${market}") t2 ON t1.transaction_id = t2.order_id WHERE t1.transaction_id <> "(not set)" AND t2.order_id is null`}
  else {ordersExcluding = `WHERE t1.transaction_id <> "(not set)"`}

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
    WITH 
    ads as (
    SELECT distinct
     t1.click_view_gclid as gclid,
     MAX(t2.campaign_name) as campaign
    FROM
      ${adsClickStats} t1
    LEFT JOIN
      ${adsCampaign} t2
    ON
      t1.campaign_id = t2.campaign_id
    GROUP BY
      t1.click_view_gclid
    ),

    ga4_sessions as (
      SELECT
        concat(user_pseudo_id,session_id) AS session_id,
        user_pseudo_id,
        date as date,
        device_category,
        MAX(CASE WHEN last_non_direct_attribution.source like "%heureka%" then "heureka.${market}" else last_non_direct_attribution.source END) as source, 
        MAX(last_non_direct_attribution.medium) as medium,
        MAX(ifnull(ifnull(t2.campaign,t1.last_non_direct_attribution.campaign),t1.traffic_source_campaign)) as campaign,
        MAX(TIMESTAMP_DIFF(session_end, session_start, SECOND)) AS session_length_seconds,
        MAX(session_engaged) as session_engaged,
        count(distinct case when ga_session_number = 1 then user_pseudo_id else null end) as new_users
      FROM
        ${ctx.ref(sessionTable)} t1
      LEFT JOIN
        ads t2
      ON
        t1.gclid = t2.gclid
      GROUP BY
        1,2,3,4
    ), 

    ga4_transactions_load as (
      SELECT
        concat(user_pseudo_id,session_id) AS session_id,
        date,
        (SELECT value.string_value from unnest (event_params) where key = "currency") as currency,
        transaction_id,
        value as revenue
      FROM
        ${ctx.ref(purchaseTable)} t1
      ${ordersExcluding}
    ),

    ga4_transactions as (
      SELECT
        t1.session_id,
        t1.date,
        count(distinct transaction_id) as transactions,
        SUM(t1.revenue) as revenue,
        SUM(t1.revenue * (1 / IFNULL(t2.rate,t3.rate))) as revenue_czk
      FROM
        ga4_transactions_load t1
      LEFT JOIN
      \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` t2
      ON
       t1.date = PARSE_DATE("%Y-%m-%d",t2.date) AND
       t1.currency = t2.code
      LEFT JOIN
        (SELECT code,rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE PARSE_DATE("%Y-%m-%d",date) = (SELECT MIN(PARSE_DATE("%Y-%m-%d",date)) FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\`)) t3
      ON
        t1.currency = t3.code
      GROUP BY
        1,2
    ),

    consented_transactions as (
      SELECT
        ga4_sessions.date as date,
        ga4_sessions.session_id,
        ga4_sessions.user_pseudo_id,
        ga4_sessions.device_category,
        IFNULL(ga4_sessions.source,"(direct)") as source, 
        IFNULL(ga4_sessions.medium,"(none)") as medium,
        ga4_sessions.campaign as campaign,
        ga4_sessions.session_length_seconds,
        ga4_sessions.session_engaged,
        ga4_sessions.new_users,
        ga4_transactions.transactions,
        ga4_transactions.revenue,
        ga4_transactions.revenue_czk
      FROM
        ga4_sessions
      LEFT JOIN 
        ga4_transactions
      ON
        ga4_sessions.Date = ga4_transactions.Date and
        ga4_sessions.session_id = ga4_transactions.session_id
    ),

    anonymized_transactions as (
      SELECT
        ga4_transactions.date as date,
        "anonymized" as session_id,
        "anonymized" as user_pseudo_id,
        "unknown" as device_category,
        "anonymized" as source, 
        "anonymized" as medium, 
        "" as campaign,
        null as session_length_seconds,
        null AS session_engaged,
        null as new_users,
        ga4_transactions.transactions,
        ga4_transactions.revenue,
        ga4_transactions.revenue_czk
      FROM
        ga4_transactions
      LEFT JOIN 
        ga4_sessions     
      ON
        ga4_transactions.Date = ga4_sessions.Date and
        ga4_transactions.session_id = ga4_sessions.session_id
      WHERE
        ga4_sessions.Date is null
    )

    SELECT
      *
    FROM
      consented_transactions

    UNION ALL

    SELECT
      *
    FROM
      anonymized_transactions
  `
).type("table").schema("ga_data_" + `${company}`).tags([`${domain}`, "table", "sessions_purchase", "out_table"]);
}
});
