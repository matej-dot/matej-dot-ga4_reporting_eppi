const { getAllVersions } = require('includes/constants');
const version = getAllVersions();


version.forEach(version => {

  const { constant } = require('includes/constants');
  const isPublish = constant(version, "ADS_LABELING" );
  const domain = constant(version, "DOMAIN");
  const tableName = "table_labeling_time_" + domain;

  // Backfill setup
  const daysBack = 1;
  
  // Labeling
  const shops_transactions = constant(version, "shops_transactions");
  const date_window_short = constant(version, "date_window_short");
  const custom_label_number = constant(version, "custom_label_number");
  const limit_pno_ads = constant(version, "limit_pno_ads");


/* ---------------------------------------------------------------*/
const currentDate = new Date();
const dateArray = [];
const tableSuffix = [];
const tableSuffixDayBack = [];

for (let i = 0; i < daysBack; i++) {
  const currentDateCopy = new Date(currentDate);
  currentDateCopy.setDate(currentDate.getDate() - i);

  const year = currentDateCopy.getFullYear();
  const month = (currentDateCopy.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const day = currentDateCopy.getDate().toString().padStart(2, '0');

  dateArray.push(currentDateCopy.toISOString()); // Adjust format as needed

  const formattedDate = `${year}${month}${day}`; 
  tableSuffix.push(formattedDate);

}

if (isPublish) {

dateArray.forEach((date, index) => {
  publish(tableName + "_" + tableSuffix[index]).query(
    ctx => `
with

global as (
SELECT
  market,
  sum(ads_revenue) / sum(item_revenue) as ads_share
FROM
  ${ctx.ref("items_profit_all")}
WHERE
  date BETWEEN DATE_SUB(parse_date("%Y%m%d", "${tableSuffix[index]}"), INTERVAL ${date_window_short} DAY) AND parse_date("%Y%m%d", "${tableSuffix[index]}") AND
  market = "${domain}"
GROUP BY
  1
), 

prep as (
SELECT
  market,
  id, 
  item_name,
  min(item_price) as item_price, 
  sum(ads_impressions) as ads_impressions,
  sum(item_transaction) as item_transactions, 
  sum(ads_transaction) as ads_transactions, 
  sum(ads_cost) as ads_cost,  
  sum(item_revenue) as item_revenue, 
  sum(ads_revenue) as ads_revenue, 
  sum(ads_cost) / NULLIF(SUM(item_revenue), 0) as pno
FROM
  ${ctx.ref("items_profit_all")}
WHERE
  date BETWEEN DATE_SUB(parse_date("%Y%m%d", "${tableSuffix[index]}"), INTERVAL ${date_window_short} DAY) AND parse_date("%Y%m%d", "${tableSuffix[index]}") AND
  market = "${domain}"
GROUP BY
  1,2,3
), 

conditions as (
 SELECT
  *,
  CASE
    WHEN 
      ifnull(prep.item_transactions,0) > ${shops_transactions} and pno < ( ${limit_pno_ads} * (select ads_share from global)) 
        then "Well (spend)" 
    WHEN 
      ifnull(prep.item_transactions,0) > ${shops_transactions} and ifnull(ads_cost,0) = 0 
        then "Well (no spend)" 
    WHEN 
      ifnull(ads_cost,0) > (ifnull(item_price,0) * ( ${limit_pno_ads} * (select ads_share from global)) ) AND  ifnull(prep.item_transactions,0) = 0
        then "Bad (no transactions)"
    WHEN 
      ifnull(ads_cost,0) > (ifnull(item_price,0) * ( ${limit_pno_ads} * (select ads_share from global)) ) AND ifnull(prep.item_transactions,0) > 0
        then "Bad (transactions)"
    ELSE
        "Boost"
  END 
    as custom_label_${custom_label_number} 
 FROM
  prep

)

SELECT
  market,
  id, 
  item_name,
  item_price, 
  ads_impressions,
  item_transactions, 
  ads_transactions, 
  ads_cost,  
  item_revenue, 
  ads_revenue, 
  custom_label_${custom_label_number} as custom_label_${custom_label_number}
FROM
  conditions
    `
  ).type("table").schema("ads_labeling_" + `${company}`).tags(["labeling","table","out_table","labeling_time"]);
});
}
});


