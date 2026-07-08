
const tableName = "ci_external_costs";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const version = getAllVersions();
const toPublish = "ex_costs";

version.forEach(version => {

  const isPublish = constant(version, toPublish.toUpperCase() );
  const domain = constant(version, "DOMAIN");
  const ga4ID = constant(version, "GA4");

  // Tables
  const inSheetExternalCosts = project_id + ".input_data.in_sheet_external_costs";

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
WITH 
input_data AS (
  SELECT
    PARSE_DATE('%m.%Y', month) AS month,
    platform,
    costs
  FROM
    ${inSheetExternalCosts}
  WHERE
    mutation = "${version}"
),
date_range AS (
  SELECT
    month,
    platform,
    costs,
    DATE_DIFF(DATE_ADD(DATE_TRUNC(month, MONTH), INTERVAL 1 MONTH), DATE_TRUNC(month, MONTH), DAY) AS days_in_month,
    DATE_DIFF(DATE_TRUNC(CURRENT_DATE(), MONTH), DATE_TRUNC(month, MONTH), DAY) + 1 AS days_till_today
  FROM
    input_data
)
SELECT
  "" as gaCampaign,
  "" as gaAdContent,
  CASE
    WHEN platform LIKE '%/%' THEN REGEXP_EXTRACT(platform, '(.*) /')
    ELSE platform
  END AS gaRowSource,
  CASE
    WHEN platform LIKE '%/%' THEN REGEXP_EXTRACT(platform, '/ (.*)')
    ELSE platform
  END AS gaRowMedium,
  0 AS gaRowClicks,
  round(costs / days_in_month,2) AS gaRowCost,
  0 AS gaRowImpressions,
  DATE_ADD(DATE_TRUNC(month, MONTH), INTERVAL offset DAY) AS gaRowDate
FROM
  date_range,
  UNNEST(GENERATE_ARRAY(0, days_in_month - 1)) AS offset
WHERE
  DATE_ADD(DATE_TRUNC(month, MONTH), INTERVAL offset DAY) <= CURRENT_DATE()
ORDER BY
  gaRowDate,
  platform
  `
).type("table").schema("ci_" + `${domain}`).tags(["out_table",`${domain}`,"table"]);
}
});

