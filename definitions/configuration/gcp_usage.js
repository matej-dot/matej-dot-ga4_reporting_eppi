
const tableName = "out_gcp_usage";

/* ---------------------------------------------------------------*/

publish(tableName,{  
  bigquery: {
    partitionBy: "date"
  }}).query(
  ctx => `
SELECT
  "query" as item,
  date(creation_time) AS date,
  project_id,
  destination_table.dataset_id AS destination_table_dataset_id,
  destination_table.table_id AS destination_table_id,
  user_email,
  job_id,
  (total_bytes_processed / 1000000000) AS processed_GB,
  (total_bytes_billed / 1000000000) AS billed_GB,
  ((total_bytes_billed / 1000000000000) * 6.25) * ${conversionRate("date(t1.creation_time)","USD")} AS cost_czk
FROM 
  region-eu.INFORMATION_SCHEMA.JOBS t1
`
).type("table").schema("ga_data_" + `${company}`).tags(["out_table","table"]);

