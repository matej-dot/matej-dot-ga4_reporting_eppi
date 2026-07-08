
const tableName = "out_custom_events";

/* ---------------------------------------------------------------*/
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const { getAllVersions } = require('includes/constants');
const version = getAllVersions();

version.forEach(version => {

  const isPublish = true;
  const domain = constant(version, "DOMAIN");
  const ga4ID = constant(version, "GA4");

  // Tables
  const ga4Events = "out_events_" + domain;
  const sessionPurchaseTable = "out_sessions_purchase_" + domain;

// ----------------------------------- Incremental where ------------------------------------ //

  function incrementalWhere(ctx) {
    return ctx.incremental()
      ? "WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL attributionWindow DAY)"
      : "";
  }

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
WITH
event_group as (
SELECT
  "${domain}" as market,
  date,
  user_pseudo_id,
  SPLIT(page_location,"?")[OFFSET(0)] as page,
  REGEXP_EXTRACT((SELECT value.string_value FROM UNNEST (event_params) WHERE key = "page_location"), r'([^?&]+)') as cart_events,
  (SELECT value.string_value FROM UNNEST (event_params) WHERE key = "page_referrer") as page_referrer,
  event_name,
   ${eventName("event_name")} as event_named,
   ${eventOrder("event_name")} as event_ordered,
   CASE
    WHEN 
      (SELECT ARRAY_AGG(item_id LIMIT 1)[OFFSET(0)] FROM UNNEST(items)) LIKE "C_%" OR
      (SELECT ARRAY_AGG(item_id LIMIT 1)[OFFSET(0)] FROM UNNEST(items)) = "ENGRAVING" OR
      (SELECT ARRAY_AGG(item_id LIMIT 1)[OFFSET(0)] FROM UNNEST(items)) = "EXPRES_DELIVERY" THEN "Služby" 
    ELSE
      (SELECT ARRAY_AGG(item_name LIMIT 1)[OFFSET(0)] FROM UNNEST(items)) 
   END as item_name,
  (SELECT ARRAY_AGG(value.string_value LIMIT 1)[OFFSET(0)] FROM UNNEST(event_params) WHERE key = "upsell") as atc_upsell,
  (SELECT ARRAY_AGG(value.string_value LIMIT 1)[OFFSET(0)] FROM UNNEST(event_params) WHERE key = "added_note") as purchase_note,
  (SELECT ARRAY_AGG(value.string_value LIMIT 1)[OFFSET(0)] FROM UNNEST(event_params) WHERE key = "user_type") as user_type,
   CASE
    WHEN 
      (SELECT ARRAY_AGG(item_id LIMIT 1)[OFFSET(0)] FROM UNNEST(items)) LIKE "C_%" OR
      (SELECT ARRAY_AGG(item_id LIMIT 1)[OFFSET(0)] FROM UNNEST(items)) = "ENGRAVING" OR
      (SELECT ARRAY_AGG(item_id LIMIT 1)[OFFSET(0)] FROM UNNEST(items)) = "EXPRES_DELIVERY" THEN NULL  
    ELSE
      (SELECT SUM(quantity) FROM UNNEST(items))
   END as quantity,
   (SELECT value.int_value FROM UNNEST (event_params) WHERE key = "scroll_depth") as scroll_depth,
   COALESCE((SELECT value.string_value FROM UNNEST (event_params) WHERE key = "blog_page_type"),"") as blog_page_type,  
   (SELECT value.string_value FROM UNNEST (event_params) WHERE key = "relevant_category") as blog_relevant_category,  
   (SELECT value.string_value FROM UNNEST (event_params) WHERE key = "click_text") as click_text,  
   (SELECT value.string_value FROM UNNEST (event_params) WHERE key = "click_url") as click_url
FROM
  ${ctx.ref(ga4Events)}  
${incrementalWhere(ctx)}
),

session_load as (
SELECT
  date,
  user_pseudo_id,
  AVG(session_length_seconds) / 60 as session_length_minutes,
  MAX(source) as source,
  MAX(medium) as medium,
  MAX(campaign) as campaign,
  MAX(device_category) as device_category
FROM
  ${ctx.ref(sessionPurchaseTable)}
${incrementalWhere(ctx)}
GROUP BY
  1,2  
)

SELECT
 t1.*,
 t2.session_length_minutes,
 CONCAT(t2.source," / ",t2.medium) as source_medium,
 ${sourceName("t2.source","t2.medium","t2.campaign")} as source_name,
 ${cartSteps("t1.cart_events","t1.event_name")} as cart_naming,
 t2.campaign,
 t2.device_category
FROM
  event_group t1
LEFT JOIN
  session_load t2
ON
  t1.date = t2.date AND
  t1.user_pseudo_id = t2.user_pseudo_id
  `
)
.type("incremental")
.schema("ga_data_staging_" + `${domain}`).tags(["incremental_table",`${domain}`,`analytics_${ga4ID}`, "custom_events"])
.preOps(ctx => {
  const windowSize = dataform.projectConfig.vars.force_load === "true"
    ? default_attribution_window + 10
    : default_attribution_window;

  return ctx.incremental() ? `
    DECLARE attributionWindow INT64 DEFAULT (${windowSize});
    DELETE FROM ${ctx.self()}
    WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL attributionWindow DAY);
  ` : ``;
})
}
});
