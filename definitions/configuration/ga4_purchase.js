
const tableName = "out_purchase";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const ga4 = require("dataform-ga4-sessions");

const version = getAllVersions();

version.forEach(version => {
    const domain = constant(version, "DOMAIN");
    const intradayTable = constant(version, "INTRADAY_TABLE");
    const incrementalWhereStatement = "event_name IN ('purchase') AND _TABLE_SUFFIX between format_date('%Y%m%d',date_sub(current_date(), interval 5 day)) and format_date('%Y%m%d',date_sub(current_date(), interval 1 day)) AND contains_substr(_TABLE_SUFFIX, 'intraday') is " + String(intradayTable);
    const nonIncrementalWhereStatement = "event_name IN ('purchase') AND contains_substr(_TABLE_SUFFIX, 'intraday') is " + String(intradayTable);
    const purchaseConfig = {
        dataset: "analytics_" + constant(version, "GA4"),
        incrementalTableName: "events_*",
        incrementalTableEventStepWhere: incrementalWhereStatement,
        nonIncrementalTableName: "events_*",
        nonIncrementalTableEventStepWhere: nonIncrementalWhereStatement
    };
    let purchase = new ga4.Event(purchaseConfig);
    purchase.setEventName("ga4_events");
    purchase.target = {
        schema: "analytics_" + constant(version, "GA4"),
        tableName: tableName + "_" + domain
    };

    if (event_id_purchase == true) {} 
        else if (event_id_purchase == false) { purchase.skipUniqueEventsStep() } 
        else { purchase.getSqlUniqueId = () => {
            return `FARM_FINGERPRINT(CONCAT(event_timestamp, event_name, (select value.string_value from unnest(event_params) where key = '` + event_id_purchase + `'), ifnull((select ep.value.int_value from unnest(event_params) as ep where ep.key = 'engagement_time_msec' ),0))) as event_id`;
    }; } ;

    purchase.addColumns([
        { name: "event_name", columnName: "event_name" },
        { name: "ecommerce.purchase_revenue", columnName: "value" },
        { name: "ecommerce.transaction_id", columnName: "transaction_id" },
        { name: "items", columnName: "items" },
        { name: "event_params", columnName: "event_params" },
    ]);
    purchase.tags = [`${domain}`, "incremental_table"];
    purchase.updatePartitionFilter =
        "date >= date_sub(current_date(), interval 5 day)";
    purchase.publish();

});
