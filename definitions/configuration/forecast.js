
const tableName = "view_forecast";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const version = getAllVersions();


version.forEach(version => {

  const isPublish = constant(version, tableName.toUpperCase() );
  const domain = constant(version, "DOMAIN");
  const currency = constant(version, "CURRENCY");

  // Tables
  const dateSplit = "out_ga4_date_split_all";
  const forecastName = project_id + ".input_data.in_sheet_forecast";
  const dailyRates = "daily_rates_*";
      

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
with

ga as (
SELECT
  format_date("%Y%m",date) as month,
  market as source,
  sum(cost) as cost,
  sum(crm_order_revenue_no_vat_czk) as revenue,
  min(month_status) as month_status,
  min(year_status) as year_status
FROM
  ${ctx.ref(dateSplit)}
WHERE
  date >= "2026-01-01" AND
  market = "${domain}"
GROUP BY
  1,2
),

forecast as (
SELECT
  format_date("%Y%m",month) as month,
  market as source,
  sum(cost) as cost, 
  sum(revenue) as revenue
FROM
  ${forecastName}
WHERE
  month is not null AND
  market = "${domain}"
GROUP BY
  1,2
)

SELECT
  "${domain}" as market,
  DATE_TRUNC(PARSE_DATE('%Y%m', COALESCE(t1.month,t2.month)), MONTH) as date,
  COALESCE(t1.source,t2.source) as source,
  t1.cost as for_cost,
  t1.revenue as for_revenue,
  t2.cost as cost,
  t2.revenue,
  t2.month_status,
  t2.year_status
FROM
  forecast t1
FULL OUTER JOIN
  ga t2
ON
  t1.month = t2.month and
  t1.source = t2.source

  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags(["forecast",`${domain}`,"view"]);
}
});

