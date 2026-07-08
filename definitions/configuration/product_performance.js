
const tableName = "view_product_performance";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const version = getAllVersions();


version.forEach(version => {

  const { constant } = require('includes/constants');
  const isPublish = constant(version, tableName.toUpperCase() );

  if (isPublish) { 

  // Variables
  const domain = constant(version, "DOMAIN");
  const currency = constant(version, "CURRENCY");

  // Conditions
  const PERIOD_IN_DAYS = 90;
  const MIN_QUANTITY = 1;
  const MIN_PRICE = 500; // Set in CZK currency
  const BRAND_FILTER = "none";  
  
  // Tables
  const ref_ga4_purchase = "out_purchase_" + domain;
  const dailyRates = "daily_rates_*";

publish(tableName + "_" + domain).query(
  ctx => `
WITH
load_table as (
SELECT
  "${domain}" as market,
  item_id,
  item_name,
  item_brand,
  item_category,
  sum(quantity) as quantity,
  sum(item_revenue) as item_revenue
FROM
  (SELECT * FROM ${ctx.ref(ref_ga4_purchase)},UNNEST (items))
WHERE
  item_name not like "%kupón%" AND
  price * ${conversionRate("'2023-01-01'",currency)} > ${MIN_PRICE} AND
  ("${BRAND_FILTER}" = "none" OR item_brand = "${BRAND_FILTER}") AND
  date > DATE_SUB(CURRENT_DATE(), INTERVAL ${PERIOD_IN_DAYS} DAY)
GROUP BY
  1,2,3,4,5
)
SELECT
  *,
  concat("top_sales_-_days:",${PERIOD_IN_DAYS},"_min_quantity:",${MIN_QUANTITY},"_brand_filter:","${BRAND_FILTER}","_min_price:",${MIN_PRICE}) as item_type
FROM
  load_table
WHERE
  quantity >= ${MIN_QUANTITY}
  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags(["view","product_performance"]).dependencies(["out_events_" + `${domain}`]);
}
});
