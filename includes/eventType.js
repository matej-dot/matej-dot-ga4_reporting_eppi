module.exports = (event_name) => {
  return `
CASE
  WHEN REGEXP_CONTAINS(${event_name},".*kosik.*") THEN "cart_events"
  ELSE "page_events"
end`;
}
