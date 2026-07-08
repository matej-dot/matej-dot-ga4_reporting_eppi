
const eventName = "out_sessions";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const version = getAllVersions();
const ga4 = require("dataform-ga4-sessions");

version.forEach(version => {

    const domain = constant(version, "DOMAIN");
    let atttributionWindow = null;
    if (dataform.projectConfig.vars.force_load === "true") 
        {atttributionWindow = default_attribution_window + 10} 
    else 
        {atttributionWindow = default_attribution_window};
    const intradayTable = constant(version, "INTRADAY_TABLE");
    const incrementalWhereStatement = "_TABLE_SUFFIX between format_date('%Y%m%d',date_sub(current_date(), interval " + atttributionWindow + " day)) and format_date('%Y%m%d',date_sub(current_date(), interval 1 day)) AND contains_substr(_TABLE_SUFFIX, 'intraday') is " + String(intradayTable);
    const nonIncrementalWhereStatement = "contains_substr(_TABLE_SUFFIX, 'intraday') is " + String(intradayTable);
    const updatePartitionFilterStatement = "date >= date_sub(current_date(), interval " + atttributionWindow + " day)"
  
    
        // Define your config
        const sourceConfig = {
        dataset: "analytics_" + constant(version, "GA4"),
        incrementalTableName: "events_XXXXXX",
        };
    
        // Session config
        const eventConfig = {
        dataset: "analytics_" + constant(version, "GA4"),
        incrementalTableName: "events_*",
        incrementalTableEventStepWhere: incrementalWhereStatement,
        nonIncrementalTableName: "events_*",
        nonIncrementalTableEventStepWhere: nonIncrementalWhereStatement
        };
    
    
        // Declare GA4 source tables
        ga4.declareSources(sourceConfig);
        // Create sessions object
        const event = new ga4.Session(eventConfig);
        event.target = {
        schema: "analytics_" + constant(version, "GA4"),
        tableName: eventName + "_" + domain
        };
    
        event.tags = [`${domain}`, "incremental_table"];

        event.LastNonDirectLookBackWindow = atttributionWindow;

        event.updatePartitionFilter = updatePartitionFilterStatement;
      
        event.addColumns([
        { name: "traffic_source.name", columnName: "traffic_source_campaign" },
        ]);

        event.addEventParams([{ name: "ga_session_number", type: "int" }]);
    
        // Publish session table
        event.publish();

}
)
