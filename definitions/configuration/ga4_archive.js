
const tableName = "view_ga4_archive";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const { project_id } = require('includes/constants');
const version = getAllVersions();


version.forEach(version => {

  const isPublish = constant(version,"GA4_ARCHIVE");
  const domain = constant(version, "DOMAIN");
  const currency = constant(version, "CURRENCY");
  const ga4ID = constant(version, "GA4");
  
  // Tables
  const ga4ArchiveTable = project_id + ".analytics_" + ga4ID + ".in_ga4_archive";

if (isPublish) {

publish(tableName + "_" + domain).query(
  ctx => `
  WITH
   transaction_count as (
  SELECT
    t1.date,
    t1.sessionSource,
    t1.sessionMedium, 
    t1.sessionCampaignName,
    count(distinct t1.transactionId) as transactions,
    sum(t1.purchaseRevenue) as purchaseRevenue,
    sum(t1.purchaseRevenue * ${conversionRate("t1.date",currency)}) as purchaseRevenueCZK,
  FROM
    ${ga4ArchiveTable} t1
  WHERE
    transactionId <> "(not set)" AND transactionId <> ""
  GROUP BY
   1,2,3,4
  ),
  users_count as (
  SELECT
    date,
    sessionSource,
    sessionMedium, 
    sessionCampaignName,
    sum(sessions) as sessions,
    sum(totalUsers) as totalUsers,
    sum(newUsers) as newUsers
  FROM
    ${ga4ArchiveTable}
  GROUP BY
   1,2,3,4
  )

  SELECT
    t1.date,
    t1.sessionSource as source,
    t1.sessionMedium as medium,
    t1.sessionCampaignName as campaign,
    null as avg_session_length, 
    null as session_engaged,
    sum(t1.totalUsers) as Users,
    sum(t1.newUsers) as new_users,
    sum(t1.sessions) as sessions, 
    sum(t2.transactions) as transactions,
    sum(t2.purchaseRevenue) as revenue,
    sum(t2.purchaseRevenueCZK) as revenue_czk,
  FROM
    users_count t1
  LEFT JOIN
    transaction_count t2
  ON
    t1.date = t2.date AND
    t1.sessionSource = t2.sessionSource AND
    t1.sessionMedium = t2.sessionMedium AND
    t1.sessionCampaignName = t2.sessionCampaignName
  GROUP BY
   1,2,3,4
  `
).type("view").schema("ga_data_staging_" + `${domain}`).tags([`${domain}`, "view", "campaign_split"]);
}
});
