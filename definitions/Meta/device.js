// ------------------------------------ Global Variables ------------------------------------ //

const tableName = "view_device";

const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const { getAllVersions } = require('includes/constants');
const version = getAllVersions();

version.forEach(version => {

// ----------------------------------- Version Variables ------------------------------------ //

  const isPublish = constant(version, "FBID") !== "";
  const fb_id = constant(version, "FBID");
  const domain = constant(version, "DOMAIN");

// -------------------------------------- Input Tables -------------------------------------- //

  // Tables
  const source_table = "`" + project_id + ".meta_api.device_split_" + fb_id + "_*`"
  
if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `

SELECT
  -- breakdown
  t1.impression_device,

  -- identity
  t1.ad_account_id,
  t1.ad_account_name,
  t1.campaign_id,
  t1.campaign_name,

  -- time
  t1.date,
  t1.date_stop,

  -- context
  t1.currency,
  t1.timezone,
  t1.spend_cap,
  t1.load_date,

  -- performance (CAST)
  CAST(t1.clicks AS INT64)        AS clicks,
  CAST(t1.impressions AS INT64)  AS impressions,
  CAST(t1.reach AS INT64)        AS reach,
  CAST(t1.spend AS FLOAT64)      AS spend,

  -- core conversions
  t1.purchase,
  t1.purchase_value,
  t1.add_to_cart,
  t1.add_to_cart_value,
  t1.initiate_checkout,
  t1.initiate_checkout_value,
  t1.view_content,
  t1.view_content_value,
  t1.add_payment_info,
  t1.add_payment_info_value,

  -- omni
  t1.omni_purchase,
  t1.omni_purchase_value,
  t1.omni_view_content,
  t1.omni_view_content_value,
  t1.omni_add_to_cart,
  t1.omni_add_to_cart_value,
  t1.omni_initiated_checkout,
  t1.omni_initiated_checkout_value,

  -- onsite web
  t1.onsite_web_purchase,
  t1.onsite_web_purchase_value,
  t1.onsite_web_add_to_cart,
  t1.onsite_web_add_to_cart_value,
  t1.onsite_web_view_content,
  t1.onsite_web_view_content_value,
  t1.onsite_web_initiate_checkout,
  t1.onsite_web_initiate_checkout_value,

  -- engagement
  t1.post_engagement,
  t1.page_engagement,
  t1.link_click,
  t1.video_view,
  t1.like AS like_count,
  t1.comment,
  t1.post_reaction,
  t1.post_interaction_gross,
  t1.frequency,
  t1.post, 
  CAST(t1.spend as FLOAT64) * (1 / IFNULL(t2.rate,t3.rate)) as spend_czk,
  CAST(t1.purchase_value as FLOAT64) * (1 / IFNULL(t2.rate,t3.rate)) as purchase_value_czk
FROM
  ${source_table} t1
LEFT JOIN
\`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` t2
ON
 t1.date = PARSE_DATE("%Y-%m-%d",t2.date) AND
 t1.currency = t2.code
LEFT JOIN
  (SELECT code,rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE PARSE_DATE("%Y-%m-%d",date) = (SELECT MIN(PARSE_DATE("%Y-%m-%d",date)) FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\`)) t3
ON
  t1.currency = t3.code
  `
).type("view").schema("meta_api").tags([`${domain}`,"view","meta_api"]);
}
});


