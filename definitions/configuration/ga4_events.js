
const tableName = "out_events";

/* ---------------------------------------------------------------*/
const { getAllVersions } = require('includes/constants');
const { constant } = require('includes/constants');
const ga4 = require("dataform-ga4-sessions");

const version = getAllVersions();

version.forEach(version => {
    const { getGA4Events } = require('includes/constants');
    const ga4_events = getGA4Events(version);
    const domain = constant(version, "DOMAIN");
    const intradayTable = constant(version, "INTRADAY_TABLE");
    const incrementalWhereStatement = "event_name IN (" + ga4_events + ") AND _TABLE_SUFFIX between format_date('%Y%m%d',date_sub(current_date(), interval 5 day)) and format_date('%Y%m%d',date_sub(current_date(), interval 1 day)) AND contains_substr(_TABLE_SUFFIX, 'intraday') is " + String(intradayTable);
    const nonIncrementalWhereStatement = "event_name IN (" + ga4_events + ") AND contains_substr(_TABLE_SUFFIX, 'intraday') is " + String(intradayTable);
    const eventConfig = {
        dataset: "analytics_" + constant(version, "GA4"),
        incrementalTableName: "events_*",
        incrementalTableEventStepWhere: incrementalWhereStatement,
        nonIncrementalTableName: "events_*",
        nonIncrementalTableEventStepWhere: nonIncrementalWhereStatement
    };
    let event = new ga4.Event(eventConfig);
    event.setEventName("ga4_events");
    event.target = {
        schema: "analytics_" + constant(version, "GA4"),
        tableName: tableName + "_" + domain
    };

    if (event_id_events == true) {} 
        else if (event_id_events == false) { event.skipUniqueEventsStep() } 
        else { event.getSqlUniqueId = () => {
            return `FARM_FINGERPRINT(CONCAT(event_timestamp, event_name, (select value.string_value from unnest(event_params) where key = '` + event_id_events + `'), ifnull((select ep.value.int_value from unnest(event_params) as ep where ep.key = 'engagement_time_msec' ),0))) as event_id`;
    }; } ;
    
    event.addColumns([
        { name: "event_name", columnName: "event_name" },
        { name: "items", columnName: "items" },
        { name: "event_params", columnName: "event_params" },
    ]);
    event.tags = [`${domain}`, "incremental_table"];
    // Okno MERGE je o 2 dni sirsie nez citane shardy (5 dni): balik pocita `date` v case
    // Europe/London, takze event tesne po polnoci (Praha) ma `date` o den skor nez jeho shard.
    // S oknom 5 dni ho MERGE na hrane okna nenasiel a pri kazdom behu vlozil znova
    // (nakupy 00:00-02:00 boli v tabulke 5-7x; zistene 12. 10. 2026).
    event.updatePartitionFilter =
        "date >= date_sub(current_date(), interval 7 day)";
    // `date` v case GA4 property (vsetky tri trhy = Europe/Prague, overene na event_date 12. 10. 2026).
    // Predvolene pasmo balika je Europe/London: eventy 00:00-01:00 mali `date` o den skor nez GA4 aj e-shop.
    event.timezone = "Europe/Prague";
    event.publish();

});
