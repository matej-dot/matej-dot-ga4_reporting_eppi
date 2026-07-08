const { getAllVersions } = require('includes/constants');
const version = getAllVersions();
const tableName = "view_item_profit";

version.forEach(version => {
  const { constant } = require('includes/constants');
  const { project_id } = require('includes/constants');
  const isPublish = constant(version, "ADS_LABELING" );
  const domain = constant(version, "DOMAIN");
  const market = constant(version, "DOMAIN").split("_")[1];
  const adsID = constant(version, "ADS");
  const currency = constant(version, "CURRENCY");
  
  // Tables
  const purchaseTable = "out_purchase_" + domain;
  const sessionTable = "out_sessions_" + domain;
  const shoppingProductStats = project_id + ".google_ads.ads_ShoppingProductStats_" + adsID;
  const adsClickStats = project_id + ".google_ads.p_ads_ClickStats_" + adsID;
  const adsCampaign = project_id + ".google_ads.p_ads_Campaign_" + adsID;

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
WITH 

LatestPrices AS (
SELECT 
  	id, MAX(date) AS latest_date
FROM 
  (SELECT * FROM ${ctx.ref("xml_all")} WHERE project = "${domain}") 
GROUP BY 
  id
),

LatestPrices_table as (
SELECT
  t.id,
  t.title,
  t.price as price,
  t.product_type,
  t.brand
FROM 
  (SELECT * FROM ${ctx.ref("xml_all")} WHERE project = "${domain}")  t
INNER JOIN 
  LatestPrices lp
ON 
  t.id = lp.id AND t.date = lp.latest_date
),

DateGenerator AS (
  SELECT day AS date_within_last_100_days
  FROM UNNEST(GENERATE_DATE_ARRAY(DATE_SUB(CURRENT_DATE(), INTERVAL 100 DAY), CURRENT_DATE(), INTERVAL 1 DAY)) AS day
),

final_xml as (
SELECT
  dg.date_within_last_100_days as date,
  t.id,
  t.title,
  t.price,
  t.product_type,
  t.brand
FROM 
  LatestPrices_table t
CROSS JOIN 
  DateGenerator dg
ORDER BY 
  t.id, dg.date_within_last_100_days
),

ads_load as (
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
      date as date,
      MAX(CASE WHEN last_non_direct_attribution.source like "%heureka%" then "heureka.${market}" else last_non_direct_attribution.source END) as source, 
      MAX(last_non_direct_attribution.medium) as medium,
    FROM
      ${ctx.ref(sessionTable)} t1
    LEFT JOIN
      ads_load t2
    ON
      t1.gclid = t2.gclid
    GROUP BY
      1,2
), 

ga4_product_load as (
  SELECT
    date as Date,
    concat(user_pseudo_id,session_id) AS session_id,
    item.item_id as item_id,
    count(distinct transaction_id) as transactions,
    sum(item.item_revenue) as item_revenue
  FROM
    ${ctx.ref(purchaseTable)},
    UNNEST(items) as item
  GROUP BY
    1,2,3
), 

ga4_product_ads as (
  SELECT
    t1.Date,
    t1.item_id,
    sum(t1.transactions) as transactions,
    sum(t1.item_revenue) as item_revenue
  FROM
    ga4_product_load t1
  LEFT JOIN
    ga4_sessions t2
  ON
    t1.date = t2.date AND
    t1.session_id = t2.session_id
  WHERE
    t2.source = "google" AND t2.medium = "cpc"
  GROUP BY
    1,2
), 

ga4_product as (
  SELECT
    t1.Date,
    t1.item_id,
    sum(t1.transactions) as transactions,
    sum(t1.item_revenue) as item_revenue,
    sum(t2.transactions) as ads_transactions, 
    sum(t2.item_revenue) as ads_revenue,
    null as impressions,
    null as clicks,
    null as cost  
  FROM
    (SELECT date, item_id, sum(transactions) as transactions, sum(item_revenue) as item_revenue FROM ga4_product_load GROUP BY 1,2) t1
  LEFT JOIN
    ga4_product_ads t2
  ON
    t1.date = t2.date AND
    t1.item_id = t2.item_id
  GROUP BY
    1,2
), 

ads as (
SELECT
  segments_date AS date,
  segments_product_item_id AS item_id,
  null as transactions,
  null as item_revenue,
  null as ads_transactions,
  null as ads_revenue,
  SUM(metrics_impressions) as impressions,
  SUM(metrics_clicks) as clicks,   
  SUM(metrics_cost_micros) / 1000000 as cost
FROM 
  ${shoppingProductStats}
GROUP BY
  1,2
),

ga4_product_all as (
SELECT
  *
FROM
  ga4_product

UNION ALL

SELECT
  *
FROM
  ads
),

table_merge as (
SELECT
  xml.Date as Date,
  xml.id as ID,
  xml.title as item_name,
  xml.brand as item_brand,
  xml.product_type as item_category_1,
  min(xml.price) as item_price,
  sum(ga4_product_all.impressions) as ads_impressions,
  sum(ga4_product_all.clicks) as ads_clicks,
  sum(ga4_product_all.cost) as ads_cost,
  sum(ga4_product_all.transactions) as item_transaction,
  sum(round(ga4_product_all.item_revenue,0)) as item_revenue,
  sum(ga4_product_all.ads_transactions) as ads_transaction,
  sum(round(ga4_product_all.ads_revenue,0)) as ads_revenue,
FROM
  ga4_product_all
LEFT JOIN
  final_xml xml
ON
  xml.date = ga4_product_all.Date and
  lower(xml.id) = lower(ga4_product_all.item_id)
GROUP BY
  1,2,3,4,5
)
SELECT
  "${domain}" as market,
  ${conversionRate("t1.date",currency)} as exchange_rate,
  t1.date,
  t1.id,
  t1.item_name,
  t1.item_brand,
  t1.item_category_1,
  t1.item_price * ${conversionRate("t1.date",currency)} as item_price,
  t1.ads_impressions,
  t1.ads_clicks,
  t1.ads_cost * ${conversionRate("t1.date",currency)} as ads_cost,
  t1.item_transaction,
  t1.item_revenue * ${conversionRate("t1.date",currency)} as item_revenue,
  t1.ads_transaction,
  t1.ads_revenue * ${conversionRate("t1.date",currency)} as ads_revenue
FROM
  table_merge t1
  `
).type("view").schema("ads_labeling_" + `${company}`).tags(["view","labeling"]);
}
});

