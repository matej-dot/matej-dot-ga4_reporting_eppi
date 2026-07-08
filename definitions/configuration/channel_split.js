
const tableName = "view_channel_split";

/* ---------------------------------------------------------------*/
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const { getAllVersions } = require('includes/constants');
const version = getAllVersions();

version.forEach(version => {

  const domain = constant(version, "DOMAIN");
  const currency = constant(version, "CURRENCY");

  // Tables
  const crmDailyExport = "`" + project_id + ".input_data." + version + "_archive_orders_basic_*`";

publish(tableName + "_" + domain).query(
  ctx => `

SELECT
  datum as date,
  CASE
    WHEN zdroj LIKE "%walk in%" THEN "prodejna"
    ELSE "online"
  END as channel,
  CASE
    WHEN zdroj LIKE "%bez komunikácie%" THEN "bez komunikace"
    WHEN zdroj LIKE "%stretnutie v showroome - rezervované%" THEN "schůzka v showroomu - rezervovaná"
    ELSE zdroj
  END as source,
  count(distinct id) as transactions,
  SUM(
   CASE
    WHEN zdroj LIKE "%walk in%" THEN CAST(Trzba_bez_DPH as FLOAT64)
    ELSE null
   END
  )  * ${conversionRate("t1.datum",currency)} as order_revenue_store,
  SUM(
   CASE
    WHEN zdroj LIKE "%walk in%" THEN null
    ELSE CAST(Trzba_bez_DPH as FLOAT64)
   END
  )  * ${conversionRate("t1.datum",currency)} as order_revenue_online,
  SUM(CAST(Trzba_bez_DPH as FLOAT64)) * ${conversionRate("t1.datum",currency)} as order_revenue_no_vat,
  SUM(CAST(Zisk as FLOAT64)) * ${conversionRate("t1.datum",currency)} as order_profit
FROM
  ${crmDailyExport} t1
GROUP BY
  1,2,3

  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags([`${domain}`, "view", "channel_split"]);
});

