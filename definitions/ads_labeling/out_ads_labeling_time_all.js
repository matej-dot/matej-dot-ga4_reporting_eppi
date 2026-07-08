const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const unionStatements = [];
const formattedVersions = [];

// Get the list of versions
const versions = getAllVersions();

versions.forEach(version => {
  // Fetch constants
  const domain = constant(version, "DOMAIN");
  const isPublish = constant(version, "ADS_LABELING");

  // Check if this version should be included
  if (isPublish) {
    // Define the table name
    const tableName = `${project_id}.ads_labeling_${company}.table_labeling_time_${domain}_*`;

    // Add the SQL statement to unionStatements
    unionStatements.push(`
      SELECT
        PARSE_DATE("%Y%m%d",_table_suffix) as date, 
        *
      FROM
        \`${tableName}\`
    `);

    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    // Define the prefix and suffix
    const prefix = "table_labeling_time_";
    const suffix = `${year}${month}${day}`;

    // Add formatted version with prefix and suffix
    formattedVersions.push(`${prefix}${domain}_${suffix}`);
  }
});

const concatedQuery = unionStatements.join('\nUNION ALL\n');

let finalQuery;
if (concatedQuery === "") {finalQuery = `SELECT CURRENT_DATE() AS date, 'no data' AS note`;} else {finalQuery = concatedQuery;}

publish("out_ads_labeling_time_all",{  
  bigquery: {
    partitionBy: "date"
  }}).query(ctx => `
${finalQuery}
  `).type("table").schema("ads_labeling_" + `${company}`).tags(["out_table", "labeling", "table"]).dependencies(formattedVersions);
