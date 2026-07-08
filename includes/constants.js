// Global variables
  project_id  = "gtm-ntxrpzps-ywm3z";
  company  = "eppi";
  default_attribution_window = 30;

// Unique by Event ID (true/false/"custom")
  event_id_purchase = "transaction_id";
  event_id_events = true;

// Version variables
const variables = {
  cz: {
      GA4: "302086207",
      FBID: "740380269478718",
      INTRADAY_TABLE: false,
      ADS: "4233861338",
      DOMAIN: "eppi_cz",
      CURRENCY: "CZK",
      UA_ARCHIVE: false,
      GA4_ARCHIVE: true,
      SJ_TABLES: true,
      EX_COSTS: true,
      EX_ORDERS: true,

    // GA4 Events
      GA4_EVENTS: [
      "page_view",
      "session_start",
      "view_item",
      "add_to_cart",
      "begin_checkout",
      "remove_from_cart",
      "add_payment_info",
      "add_shipping_info",
      "view_search_results",
      "purchase",
      "blog_page_view",
      "outbound_click",
      "page_scroll"
      ],

    // Tables
      VIEW_COSTS: true,
      VIEW_FORECAST: true,
      VIEW_CAMPAIGN_SPLIT: true,
      VIEW_DATE_SPLIT: true,
      VIEW_DATA_QUALITY: true,
      VIEW_ECOMMERCE_EVENTS: true,
      OUT_CUSTOM_EVENTS: true,
      VIEW_PRODUCT_PERFORMANCE: true,

    // Feeds
      PRODUCT_FEED: "input_data.google_domena_cz",

    // Ads labeling variables
      ADS_LABELING: false,
      shops_transactions: 0,
      date_window_short: 90,
      custom_label_number: "2",
      limit_pno_ads: 0.3
  },
  sk: {
      GA4: "302578651",
      FBID: "435201737950097",
      INTRADAY_TABLE: false,
      ADS: "7259076220",
      DOMAIN: "eppi_sk",
      CURRENCY: "EUR",
      UA_ARCHIVE: false,
      GA4_ARCHIVE: true,
      SJ_TABLES: true,
      EX_COSTS: true,
      EX_ORDERS: true,

    // GA4 Events
      GA4_EVENTS: [
      "page_view",
      "session_start",
      "view_item",
      "add_to_cart",
      "begin_checkout",
      "remove_from_cart",
      "add_payment_info",
      "add_shipping_info",
      "view_search_results",
      "purchase",
      "blog_page_view",
      "outbound_click",
      "page_scroll"
      ],

    // Tables
      VIEW_COSTS: true,
      VIEW_FORECAST: true,
      VIEW_CAMPAIGN_SPLIT: true,
      VIEW_DATE_SPLIT: true,
      VIEW_DATA_QUALITY: true,
      VIEW_ECOMMERCE_EVENTS: true,
      OUT_CUSTOM_EVENTS: true,
      VIEW_PRODUCT_PERFORMANCE: true,

    // Feeds
      PRODUCT_FEED: "input_data.google_domena_cz",

    // Ads labeling variables
      ADS_LABELING: false,
      shops_transactions: 0,
      date_window_short: 90,
      custom_label_number: "2",
      limit_pno_ads: 0.3
  },
  de: {
      GA4: "302572986",
      FBID: "306618837664810",
      INTRADAY_TABLE: false,
      ADS: "3837119790",
      DOMAIN: "eppi_de",
      CURRENCY: "EUR",
      UA_ARCHIVE: false,
      GA4_ARCHIVE: true,
      SJ_TABLES: true,
      EX_COSTS: true,
      EX_ORDERS: true,

    // GA4 Events
      GA4_EVENTS: [
      "page_view",
      "session_start",
      "view_item",
      "add_to_cart",
      "begin_checkout",
      "remove_from_cart",
      "add_payment_info",
      "add_shipping_info",
      "view_search_results",
      "purchase",
      "blog_page_view",
      "outbound_click",
      "page_scroll"
      ],

    // Tables
      VIEW_COSTS: true,
      VIEW_FORECAST: true,
      VIEW_CAMPAIGN_SPLIT: true,
      VIEW_DATE_SPLIT: true,
      VIEW_DATA_QUALITY: true,
      VIEW_ECOMMERCE_EVENTS: true,
      OUT_CUSTOM_EVENTS: true,
      VIEW_PRODUCT_PERFORMANCE: true,

    // Feeds
      PRODUCT_FEED: "input_data.google_domena_cz",

    // Ads labeling variables
      ADS_LABELING: false,
      shops_transactions: 0,
      date_window_short: 90,
      custom_label_number: "2",
      limit_pno_ads: 0.3
  }
  // Add more versions as needed
};

// Use optional chaining and nullish coalescing for concise handling
function constant(version, variable) {
  return variables[version]?.[variable] ?? undefined;
}

function getGA4Events(version) {
  const ga4Events = variables[version]?.GA4_EVENTS || [];
  return "'" + ga4Events.join("', '") + "'";
}

function getAllVersions() {
  return Object.keys(variables);
}

module.exports = {
  constant,
  project_id,
  default_attribution_window,
  company,
  getAllVersions,
  getGA4Events,
  event_id_purchase,
  event_id_events
};
