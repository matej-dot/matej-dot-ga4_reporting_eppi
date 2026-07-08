
const tableName = "view_coupons";

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
  const couponTable = "`" + project_id + ".input_data." + version + "_coupons_*`";
  const orderTable = "`" + project_id + ".input_data." + version + "_archive_orders_basic_*`";

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
  WITH

  order_table as (
    SELECT
      datum as date, 
      id as order_id,
      Trzba_bez_DPH as revenue
    FROM
      ${orderTable}
  ),

  coupon_table as (
    SELECT
      date,
      order_id,
      coupon_id,
      code_name,
      valid_from,
      valid_to,
      discount_value,
      discount_perc,
      order_value_plus_vat,
      order_value
    FROM
      ${couponTable}
  ), 

  merge_table as (
  SELECT
    t1.date,
    t1.order_id,
    t2.coupon_id,
    t2.code_name,
    t2.valid_from,
    t2.valid_to,
    t2.discount_value,
    t2.discount_perc,
    t2.order_value_plus_vat,
    t2.order_value,
    t1.revenue
  FROM
    order_table t1
  LEFT JOIN
    coupon_table t2
  ON
    t1.order_id = t2.order_id
  )

  SELECT
    "${domain}" as market,
    date,
    IFNULL(code_name,"bez kuponu") AS coupon_name,
    CASE
      WHEN valid_from IS NULL THEN ""
      ELSE CONCAT("od ",CAST(valid_from as STRING)," do ",CAST(valid_to as STRING))
    END as coupon_validity,
    AVG(SAFE_CAST(NULLIF(discount_perc, "") AS FLOAT64)) AS percentage_value,
    COUNT(DISTINCT order_id) AS transactions,
    SUM(SAFE_CAST(NULLIF(revenue, "") AS FLOAT64) * ${conversionRate("t1.date",currency)}) AS revenue,
    COUNT(DISTINCT
      CASE
      WHEN code_name IS NULL THEN order_id
      END
      ) as transactions_no_coupon,
    COUNT(DISTINCT
      CASE
      WHEN code_name IS NOT NULL THEN order_id
      END
      ) as transactions_with_coupon
  FROM
    merge_table t1
  GROUP BY
    1,2,3,4
  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags(["coupons",`${domain}`,"view"]);
}
});

