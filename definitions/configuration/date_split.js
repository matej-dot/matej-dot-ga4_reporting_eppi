
const tableName = "view_date_split";

/* ---------------------------------------------------------------*/
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const { getAllVersions } = require('includes/constants');
const version = getAllVersions();

version.forEach(version => {

  const isPublish = constant(version, tableName.toUpperCase() );
  const domain = constant(version, "DOMAIN");
  const currency = constant(version, "CURRENCY");

  // Tables
  const campaignName = "view_campaign_split_" + domain;
  const crmDailyExport = "`" + project_id + ".input_data." + version + "_archive_orders_basic_*`";
  const costTable = "view_costs_" + domain;
  const extLabels = project_id + ".input_data.in_sheet_external_events";

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
WITH 

costs as (
SELECT
    t1.date,
    sum(t1.impressions) as impressions,
    sum(t1.clicks) as clicks,
    sum(
        CASE 
          WHEN "${version}" = "de" AND t1.source LIKE "%facebook%" THEN  t1.cost / ${conversionRate("t1.date","EUR")}
          ELSE t1.cost
        END
      ) AS cost
FROM
  ${ctx.ref(costTable)} t1
GROUP BY
  1
), 

sessions as (
SELECT
  date,
  month_of_year,
  day_of_week,
  third_of_month,
  sum(Users) as Users,
  sum(new_users) as new_users,
  sum(Sessions) as Sessions,
  sum(impressions) as impressions,
  sum(clicks) as clicks,
  sum(cost_czk) as cost,
  sum(Transactions) as Transactions,
  round(sum(revenue_czk),0) as Revenue,
  sum(predicted_cost_czk) as predicted_cost,
  sum(predicted_transactions) as predicted_transactions,
  round(sum(predicted_revenue_czk),0) as predicted_revenue,
  min(month_status) as month_status,
  min(year_status) as year_status
FROM
  ${ctx.ref(campaignName)}
GROUP BY
  1,2,3,4
), 

crm as (
SELECT
  datum as date,
  count(distinct id) as transactions,
  SUM(CAST(Trzba_bez_DPH as FLOAT64)) as order_revenue_no_vat,
  SUM(CAST(Zisk as FLOAT64)) as order_profit
FROM
  ${crmDailyExport}
GROUP BY
  1
),

merge_table as (
SELECT
  COALESCE(sessions.date,crm.date,costs.date) as date,
  sessions.month_of_year,
  sessions.day_of_week,
  sessions.third_of_month,
  costs.impressions,
  costs.clicks,
  costs.cost,
  sessions.Users,
  sessions.new_users,
  sessions.Sessions,
  sessions.Transactions as ga_transactions,
  sessions.Revenue as ga_revenue,
  crm.transactions as crm_transactions,
  crm.order_revenue_no_vat as crm_order_revenue_no_vat,
  crm.order_profit as crm_order_profit,
  sessions.predicted_cost,
  sessions.predicted_transactions,
  sessions.predicted_revenue as predicted_ga_revenue,
  crm.order_revenue_no_vat / sessions.month_status as predicted_crm_revenue,
  crm.order_profit / sessions.month_status as predicted_crm_profit,
  sessions.month_status,
  sessions.year_status
FROM
  sessions
FULL OUTER JOIN 
  crm
ON
  sessions.date = crm.date
FULL OUTER JOIN 
  costs
ON
  sessions.date = costs.date
),

ext_labels AS (
SELECT
  DATE_ARRAY AS date,
  max(event) as event,
  max(description) as description
FROM
  ${extLabels},
UNNEST(GENERATE_DATE_ARRAY(DATE(start_date), DATE(end_date), INTERVAL 1 DAY)) AS DATE_ARRAY
WHERE
  market = "${version}"
GROUP BY
  1
)

SELECT
  "${domain}" as market,
  ${conversionRate("t1.date",currency)} as exchange_rate,
  ${monthStatus("t1.date")} as days_count,
  t1.date,
  t1.month_of_year,
  t1.day_of_week,
  t1.third_of_month,
  t2.event as label_event,
  t2.description as label_description,
  t1.impressions,
  t1.clicks,
  t1.cost * ${conversionRate("t1.date",currency)} as cost,
  t1.Users,
  t1.new_users,
  t1.Sessions,
  t1.ga_transactions,
  t1.ga_revenue as ga_revenue_czk,
  t1.crm_transactions,
  t1.crm_order_revenue_no_vat * ${conversionRate("t1.date",currency)} as crm_order_revenue_no_vat_czk,
  t1.crm_order_profit * ${conversionRate("t1.date",currency)} as crm_order_profit_czk,
  t1.predicted_cost,
  t1.predicted_transactions,
  t1.predicted_ga_revenue as predicted_ga_revenue_czk,
  t1.predicted_crm_revenue * ${conversionRate("t1.date",currency)} as predicted_crm_revenue_czk,
  t1.predicted_crm_profit * ${conversionRate("t1.date",currency)} as predicted_crm_profit_czk,
  t1.month_status,
  t1.year_status
FROM
  merge_table t1
LEFT JOIN
  ext_labels t2
ON
  t1.date = t2.date
  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags([`${domain}`, "view", "date_split"]);
}
});

