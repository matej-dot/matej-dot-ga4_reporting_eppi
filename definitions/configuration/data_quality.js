
const tableName = "view_data_quality";

/* ---------------------------------------------------------------*/
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const { getAllVersions } = require('includes/constants');
const version = getAllVersions();

version.forEach(version => {

  const domain = constant(version, "DOMAIN");
  const ga4 = constant(version, "GA4");
  const uaArchive = constant(version, "UA_ARCHIVE");
  const ga4Archive = constant(version, "GA4_ARCHIVE");
  const isPublish = constant(version, tableName.toUpperCase());
  const sj_tables = constant(version, "SJ_TABLES");

  // Tables
  const uaArchiveTable = project_id + ".ga_data_staging_" + domain + ".in_ua_archive";
  const ga4ArchiveTable = project_id + ".analytics_" + ga4 + ".in_ga4_archive";
  const ga4Source = "`" + project_id + ".analytics_" + ga4 + ".events_*`";
  const costTable = "`" + project_id + ".ci_" + domain + ".ci_*`";
  const jilekCosts = "`" + project_id + ".ci_" + domain + ".sj_*`";
  const reportTable = project_id + ".ga_data_" + company + ".out_ga4_campaign_split_all";
  const currency = constant(version, "CURRENCY");

// -------------------------------------- Jilek exist --------------------------------------- //

  const jilekQuery = ` UNION ALL SELECT date, sum(cost) AS running_cost FROM ${jilekCosts} GROUP BY 1` ;

  if (sj_tables) {
    jilekTable = jilekQuery
  } else {
    jilekTable = ""
  }

  //Variables
  let finalQuery;

  if (uaArchive === true && ga4Archive === true) { finalQuery = `(
WITH 

running_cost_load as (
SELECT gaRowDate as date,
cast(sum(gaRowCost) as integer) as running_cost
FROM
 ${costTable}
GROUP BY
1
${jilekTable}
),

running_cost as (
SELECT 
  date,
  SUM(running_cost) as running_cost
FROM
 running_cost_load
GROUP BY
1
),

row_data_load as (
SELECT
  PARSE_DATE("%Y%m%d", _table_suffix) as date,
  (SELECT value.string_value from unnest (event_params) where key = "currency") as currency,
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") as transaction_id,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_double,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.int_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_integer
FROM
  ${ga4Source} 
WHERE
  _table_suffix not like "%intraday%" and 
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") <> "(not set)" and 
  event_name = "purchase"
),

raw_data as (
SELECT
t1.date,
count(distinct transaction_id) as raw_transactions,
cast(sum(COALESCE(raw_revenue_double,raw_revenue_integer) * (1 / IFNULL(t2.rate,t3.rate))) as integer) as raw_revenue
FROM
  row_data_load t1
LEFT JOIN
\`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` t2
ON
 t1.date = PARSE_DATE("%Y-%m-%d",t2.date) AND
 t1.currency = t2.code
LEFT JOIN
  (SELECT code,rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE PARSE_DATE("%Y-%m-%d",date) = (SELECT MIN(PARSE_DATE("%Y-%m-%d",date)) FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\`)) t3
ON
  t1.currency = t3.code
GROUP BY
  1
),

ua_archive as (
SELECT
date,
cast(sum(cost) as integer) as ua_cost,
sum(transactions) as ua_transactions,
cast(sum(Revenue) as integer) as ua_revenue
FROM
  ${uaArchiveTable}
GROUP BY
1
),

date_range AS (
  SELECT DATE_ADD(DATE_TRUNC(CURRENT_DATE(), DAY), INTERVAL -i DAY) AS formatted_date
  FROM UNNEST(GENERATE_ARRAY(0, DATE_DIFF(CURRENT_DATE(), DATE((SELECT MIN(date) FROM ua_archive)), DAY), 1)) AS i
),

ga4_archive as (
SELECT
t1.date,
count(distinct t1.transactionId) as ga4_transactions,
cast(sum(t1.purchaseRevenue * ${conversionRate("t1.date",currency)}) as integer) as ga4_revenue
FROM
 ${ga4ArchiveTable} t1
WHERE
  t1.transactionId <> "(not set)"
GROUP BY
1
),

rep_data as (
SELECT
date,
cast(sum(cost) as integer) as rep_cost,
sum(transactions) as rep_transactions,
sum(IF(IS_NAN(revenue_czk), NULL, revenue_czk)) AS rep_revenue
FROM
  ${reportTable}
WHERE
market = "${domain}"
GROUP BY
1
)
select
  date_table.formatted_date as date,
  ua_cost * ${conversionRate("date_table.formatted_date",currency)} as ua_cost,
  running_cost * ${conversionRate("date_table.formatted_date",currency)} as running_cost,
  rep_cost * ${conversionRate("date_table.formatted_date",currency)} as rep_cost,
  ua_transactions,
  ga4_transactions,
  raw_transactions,
  rep_transactions,
  ua_revenue * ${conversionRate("date_table.formatted_date",currency)} as ua_revenue,
  ga4_revenue,
  raw_revenue,
  rep_revenue as rep_revenue
from
  (SELECT DISTINCT formatted_date FROM date_range) date_table
LEFT JOIN
  raw_data t1
ON
  date_table.formatted_date = t1.date
LEFT JOIN
  rep_data t2
ON
  date_table.formatted_date = t2.date
LEFT JOIN
  ga4_archive t3
ON
  date_table.formatted_date = t3.date
LEFT JOIN
  ua_archive t4
ON
  date_table.formatted_date = t4.date
LEFT JOIN
  running_cost t5
ON
  date_table.formatted_date = t5.date
ORDER BY
  1 desc  
)`
}
    else if 
      (uaArchive === false && ga4Archive === true) {finalQuery = `(
WITH 

running_cost_load as (
SELECT gaRowDate as date,
cast(sum(gaRowCost) as integer) as running_cost
FROM
 ${costTable}
GROUP BY
1
${jilekTable}
),

running_cost as (
SELECT 
  date,
  SUM(running_cost) as running_cost
FROM
 running_cost_load
GROUP BY
1
),
row_data_load as (
SELECT
  PARSE_DATE("%Y%m%d", _table_suffix) as date,
  (SELECT value.string_value from unnest (event_params) where key = "currency") as currency,
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") as transaction_id,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_double,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.int_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_integer
FROM
  ${ga4Source} 
WHERE
  _table_suffix not like "%intraday%" and 
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") <> "(not set)" and 
  event_name = "purchase"
),

raw_data as (
SELECT
t1.date,
count(distinct transaction_id) as raw_transactions,
cast(sum(COALESCE(raw_revenue_double,raw_revenue_integer) * (1 / IFNULL(t2.rate,t3.rate))) as integer) as raw_revenue
FROM
  row_data_load t1
LEFT JOIN
\`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` t2
ON
 t1.date = PARSE_DATE("%Y-%m-%d",t2.date) AND
 t1.currency = t2.code
LEFT JOIN
  (SELECT code,rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE PARSE_DATE("%Y-%m-%d",date) = (SELECT MIN(PARSE_DATE("%Y-%m-%d",date)) FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\`)) t3
ON
  t1.currency = t3.code
GROUP BY
  1
),

ga4_archive as (
SELECT
t1.date,
count(distinct t1.transactionId) as ga4_transactions,
cast(sum(t1.purchaseRevenue * ${conversionRate("t1.date",currency)}) as integer) as ga4_revenue
FROM
 ${ga4ArchiveTable} t1
WHERE
  t1.transactionId <> "(not set)"
GROUP BY
1
),

date_range AS (
  SELECT DATE_ADD(DATE_TRUNC(CURRENT_DATE(), DAY), INTERVAL -i DAY) AS formatted_date
  FROM UNNEST(GENERATE_ARRAY(0, DATE_DIFF(CURRENT_DATE(), DATE((SELECT MIN(date) FROM ga4_archive)), DAY), 1)) AS i
),

rep_data as (
SELECT
date,
cast(sum(cost) as integer) as rep_cost,
sum(transactions) as rep_transactions,
sum(IF(IS_NAN(revenue_czk), NULL, revenue_czk)) AS rep_revenue
FROM
  ${reportTable}
WHERE
market = "${domain}"
GROUP BY
1
)
select
  date_table.formatted_date as date,
  null as ua_cost,
  running_cost * ${conversionRate("date_table.formatted_date",currency)} as running_cost,
  rep_cost * ${conversionRate("date_table.formatted_date",currency)} as rep_cost,
  null as ua_transactions,
  ga4_transactions,
  raw_transactions,
  rep_transactions,
  null as ua_revenue,
  ga4_revenue,
  raw_revenue,
  rep_revenue
from
  (SELECT DISTINCT formatted_date FROM date_range) date_table
LEFT JOIN
  raw_data t1
ON
  date_table.formatted_date = t1.date
LEFT JOIN
  rep_data t2
ON
  date_table.formatted_date = t2.date
LEFT JOIN
  ga4_archive t3
ON
  date_table.formatted_date = t3.date
LEFT JOIN
  running_cost t5
ON
  date_table.formatted_date = t5.date
ORDER BY
  1 desc   
)`}
    else if 
      (uaArchive === true && ga4Archive === false) {finalQuery = `(
WITH 

running_cost_load as (
SELECT gaRowDate as date,
cast(sum(gaRowCost) as integer) as running_cost
FROM
 ${costTable}
GROUP BY
1
${jilekTable}
),

running_cost as (
SELECT 
  date,
  SUM(running_cost) as running_cost
FROM
 running_cost_load
GROUP BY
1
),

row_data_load as (
SELECT
  PARSE_DATE("%Y%m%d", _table_suffix) as date,
  (SELECT value.string_value from unnest (event_params) where key = "currency") as currency,
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") as transaction_id,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_double,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.int_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_integer
FROM
  ${ga4Source} 
WHERE
  _table_suffix not like "%intraday%" and 
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") <> "(not set)" and 
  event_name = "purchase"
),

raw_data as (
SELECT
t1.date,
count(distinct transaction_id) as raw_transactions,
cast(sum(COALESCE(raw_revenue_double,raw_revenue_integer) * (1 / IFNULL(t2.rate,t3.rate))) as integer) as raw_revenue
FROM
  row_data_load t1
LEFT JOIN
\`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` t2
ON
 t1.date = PARSE_DATE("%Y-%m-%d",t2.date) AND
 t1.currency = t2.code
LEFT JOIN
  (SELECT code,rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE PARSE_DATE("%Y-%m-%d",date) = (SELECT MIN(PARSE_DATE("%Y-%m-%d",date)) FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\`)) t3
ON
  t1.currency = t3.code
GROUP BY
  1
),

ua_archive as (
SELECT
date,
cast(sum(cost) as integer) as ua_cost,
sum(transactions) as ua_transactions,
cast(sum(Revenue) as integer) as ua_revenue
FROM
  ${uaArchiveTable}
GROUP BY
1
),

date_range AS (
  SELECT DATE_ADD(DATE_TRUNC(CURRENT_DATE(), DAY), INTERVAL -i DAY) AS formatted_date
  FROM UNNEST(GENERATE_ARRAY(0, DATE_DIFF(CURRENT_DATE(), DATE((SELECT MIN(date) FROM ua_archive)), DAY), 1)) AS i
),

rep_data as (
SELECT
date,
cast(sum(cost) as integer) as rep_cost,
sum(transactions) as rep_transactions,
sum(IF(IS_NAN(revenue_czk), NULL, revenue_czk)) AS rep_revenue
FROM
  ${reportTable}
WHERE
market = "${domain}"
GROUP BY
1
)
select
  date_table.formatted_date as date,
  ua_cost * ${conversionRate("date_table.formatted_date",currency)} as ua_cost,
  running_cost * ${conversionRate("date_table.formatted_date",currency)} as running_cost,
  rep_cost * ${conversionRate("date_table.formatted_date",currency)} as rep_cost,
  ua_transactions,
  null as ga4_transactions,
  raw_transactions,
  rep_transactions,
  ua_revenue * ${conversionRate("date_table.formatted_date",currency)} as ua_revenue,
  null as ga4_revenue,
  raw_revenue,
  rep_revenue
from
  (SELECT DISTINCT formatted_date FROM date_range) date_table
LEFT JOIN
  raw_data t1
ON
  date_table.formatted_date = t1.date
LEFT JOIN
  rep_data t2
ON
  date_table.formatted_date = t2.date
LEFT JOIN
  ua_archive t4
ON
  date_table.formatted_date = t4.date
LEFT JOIN
  running_cost t5
ON
  date_table.formatted_date = t5.date
ORDER BY
  1 desc 
)`}
    else {finalQuery = `(
WITH 

running_cost_load as (
SELECT gaRowDate as date,
cast(sum(gaRowCost) as integer) as running_cost
FROM
 ${costTable}
GROUP BY
1
${jilekTable}
),

running_cost as (
SELECT 
  date,
  SUM(running_cost) as running_cost
FROM
 running_cost_load
GROUP BY
1
),

row_data_load as (
SELECT
  PARSE_DATE("%Y%m%d", _table_suffix) as date,
  (SELECT value.string_value from unnest (event_params) where key = "currency") as currency,
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") as transaction_id,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_double,
  IF(IS_NAN((SELECT value.double_value FROM UNNEST(event_params) WHERE key = "value")), NULL, 
     (SELECT value.int_value FROM UNNEST(event_params) WHERE key = "value")) AS raw_revenue_integer
FROM
  ${ga4Source} 
WHERE
  _table_suffix not like "%intraday%" and 
  (SELECT value.string_value from unnest (event_params) where key = "transaction_id") <> "(not set)" and 
  event_name = "purchase"
),

raw_data as (
SELECT
t1.date,
count(distinct transaction_id) as raw_transactions,
cast(sum(COALESCE(raw_revenue_double,raw_revenue_integer) * (1 / IFNULL(t2.rate,t3.rate))) as integer) as raw_revenue
FROM
  row_data_load t1
LEFT JOIN
\`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` t2
ON
 t1.date = PARSE_DATE("%Y-%m-%d",t2.date) AND
 t1.currency = t2.code
LEFT JOIN
  (SELECT code,rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE PARSE_DATE("%Y-%m-%d",date) = (SELECT MIN(PARSE_DATE("%Y-%m-%d",date)) FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\`)) t3
ON
  t1.currency = t3.code
GROUP BY
  1
),

date_range AS (
  SELECT DATE_ADD(DATE_TRUNC(CURRENT_DATE(), DAY), INTERVAL -i DAY) AS formatted_date
  FROM UNNEST(GENERATE_ARRAY(0, DATE_DIFF(CURRENT_DATE(), DATE((SELECT MIN(date) FROM raw_data)), DAY), 1)) AS i
),

rep_data as (
SELECT
date,
cast(sum(cost) as integer) as rep_cost,
sum(transactions) as rep_transactions,
sum(IF(IS_NAN(revenue_czk), NULL, revenue_czk)) AS rep_revenue
FROM
  ${reportTable}
WHERE
market = "${domain}"
GROUP BY
1
)
select
  date_table.formatted_date as date,
  null as ua_cost,
  running_cost * ${conversionRate("date_table.formatted_date",currency)} as running_cost,
  rep_cost * ${conversionRate("date_table.formatted_date",currency)} as rep_cost,
  null as ua_transactions,
  null as ga4_transactions,
  raw_transactions,
  rep_transactions,
  null as ua_revenue,
  null as ga4_revenue,
  raw_revenue,
  rep_revenue
from
  (SELECT DISTINCT formatted_date FROM date_range) date_table
LEFT JOIN
  raw_data t1
ON
  date_table.formatted_date = t1.date
LEFT JOIN
  rep_data t2
ON
  date_table.formatted_date = t2.date
LEFT JOIN
  running_cost t5
ON
  date_table.formatted_date = t5.date
ORDER BY
  1 desc 
)`}
  
if (isPublish) {  
publish(tableName + "_" + domain).query(
  ctx => `
SELECT
"${domain}" as market,
*
FROM
${finalQuery}
  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags([`${domain}`, "data_quality","view"]).dependencies(["out_ga4_campaign_split_all"]);
}
});
