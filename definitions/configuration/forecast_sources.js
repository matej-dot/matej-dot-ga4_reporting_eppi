
const tableName = "view_forecast_sources";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const version = getAllVersions();


version.forEach(version => {

  const isPublish = true;
  const domain = constant(version, "DOMAIN");
  const currency = constant(version, "CURRENCY");

  // Tables
  const costTable = "out_ga4_campaign_split_all";
  const forecastName = project_id + ".input_data.in_sheet_forecast_sources";
  const dailyRates = "daily_rates_*";
      

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
with

ga as (
SELECT
  format_date("%Y%m",date) as month,
  market,
  CASE 
    WHEN source LIKE "%google%" THEN "google"
    WHEN source LIKE "%seznam%" THEN "seznam"
    WHEN source LIKE "%facebook%" THEN "meta"
  END as source,
  sum(cost_czk) as cost,
  min(month_status) AS month_status,
  min(year_status) AS year_status
FROM
  ${ctx.ref(costTable)} 
WHERE
  date >= "2026-01-01" AND 
  (source LIKE "%google%" OR source LIKE "%seznam%" OR source LIKE "%facebook%") AND
  market = "${domain}"
GROUP BY
  1,2,3
),

forecast as (
SELECT
  format_date("%Y%m",month) as month,
  market,
  source,
  sum(budget) as cost
FROM
  ${forecastName}
WHERE
  month is not null AND
  market = "${domain}"
GROUP BY
  1,2,3
)

SELECT
  "${domain}" as market,
  DATE_TRUNC(PARSE_DATE('%Y%m', COALESCE(t1.month,t2.month)), MONTH) as date,
  COALESCE(t1.source,t2.source) as source,
  t1.cost as for_cost,
  t2.cost as cost,
  t2.month_status,
  t2.year_status
FROM
  forecast t1
FULL OUTER JOIN
  ga t2
ON
  t1.month = t2.month and
  t1.market = t2.market and
  t1.source = t2.source

  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags(["forecast",`${domain}`,"view"]);
}
});

