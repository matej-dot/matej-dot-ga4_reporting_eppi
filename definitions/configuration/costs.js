// ------------------------------------ Global Variables ------------------------------------ //

const tableName = "view_costs";

const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const { getAllVersions } = require('includes/constants');
const version = getAllVersions();

version.forEach(version => {

// ----------------------------------- Version Variables ------------------------------------ //

  const isPublish = constant(version, tableName.toUpperCase() );
  const domain = constant(version, "DOMAIN");
  const dataset = "analytics_" + constant(version, "GA4");
  const sj_tables = constant(version, "SJ_TABLES");

// -------------------------------------- Input Tables -------------------------------------- //

  // Tables
  const uaArchiveTable = project_id + ".ga_data_staging_" + domain + ".in_ua_archive";
  const runningCosts = "`" + project_id + ".ci_" + domain + ".ci_*`";
  const jilekCosts = "`" + project_id + ".ci_" + domain + ".sj_*`";
  const exCostTableName = "ci_external_costs_" + domain;
  
// ------------------------------- UA Archive Transformation -------------------------------- //

  const ua_archive_query = `
    ci_archive as (
      SELECT 
        date, 
        source, 
        medium, 
        campaign, 
        null as impressions, 
        null as clicks, 
        cost
      FROM
        ${uaArchiveTable}
        ),
  `;

// --------------------------------- UA Archive Conditions ---------------------------------- //
  
  let ua_archive;
  let ua_date; 
  let running_date; 
  const ua_date_query = `SELECT * FROM ci_archive WHERE Date <= (SELECT MAX(date) from ${uaArchiveTable}) UNION ALL`;
  const no_archive_date_query = `SELECT * FROM ci_running`;
  const archive_date_query = `SELECT * FROM ci_running WHERE date > (SELECT MAX(date) from ${uaArchiveTable})`;
  const costDate = `(SELECT PARSE_DATE("%Y%m%d",SPLIT(table_id, '_')[OFFSET(1)]) as table_id, FROM \`${project_id}.${dataset}.__TABLES__\` WHERE table_id not like "%intraday%" AND table_id like "events%" ORDER BY 1 desc LIMIT 1)`;

  if (constant(version, "UA_ARCHIVE")) {
    ua_archive = ua_archive_query;
    ua_date = ua_date_query;
    running_date = archive_date_query;
  } else {
      ua_archive = "";
      ua_date = "";
      running_date = no_archive_date_query
    };

// -------------------------------------- Jilek exist --------------------------------------- //

  let sj_union_query = "";
  if (sj_tables) {
    sj_union_query = `
    UNION ALL SELECT date, source, medium, campaign_name as campaign, sum(impressions) as impressions, sum(clicks) as clicks, sum(cost) AS cost  FROM ${jilekCosts} GROUP BY 1, 2, 3, 4
    `;
  }

// ---------------------------------------- SQL Code ---------------------------------------- //
  
if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
WITH 
${ua_archive}
ci_running AS (
  SELECT
      gaRowDate as date,
      REPLACE(gaRowSource,"cpc","facebook") as source,
      REPLACE(gaRowMedium,"facebook","cpc") as medium,
      gaCampaign as campaign,
      sum(gaRowImpressions) as impressions,
      sum(gaRowClicks) as clicks,
      sum(gaRowCost) AS cost
  FROM 
    ${runningCosts}
  WHERE
    _table_suffix not like "%external%"
  GROUP BY 
    1, 2, 3, 4   
${sj_union_query}
),
table_union AS (
  ${ua_date}
  ${running_date}
)
SELECT
  table_union.date AS date,
  FORMAT_DATE('%Y%m', table_union.date) AS month_of_year,
  table_union.source,
  table_union.medium,
  ${campaignRename(domain,"table_union.campaign")} AS campaign,
  table_union.impressions,
  table_union.clicks,
  table_union.Cost
FROM
  table_union

UNION ALL

SELECT
    gaRowDate as date,
    FORMAT_DATE('%Y%m', gaRowDate) AS month_of_year,
    gaRowSource as source,
    gaRowMedium as medium,
    gaCampaign as campaign,
    sum(gaRowImpressions) as impressions,
    sum(gaRowClicks) as clicks,
    sum(gaRowCost) AS cost
FROM 
  ${runningCosts}
WHERE
  _table_suffix like "%external%"
GROUP BY 
  1, 2, 3, 4, 5 
  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags([`${domain}`,"view"]).dependencies(constant(version, "EX_COSTS") == true ? `${exCostTableName}` : [] );
}
});


