module.exports = (cart_events,event_name) => {
  return `
CASE
  WHEN ${cart_events} LIKE "%/nakupni-karta%" OR ${cart_events} LIKE "%/cart%" OR ${cart_events} LIKE "%/nakupna-karta%" THEN "Košík"
  WHEN ${cart_events} LIKE "%/doprava%" OR ${cart_events} LIKE "%/versand%" THEN "Doprava"
  WHEN ${cart_events} LIKE "%/pokladna%" OR ${cart_events} LIKE "%/zahlung%" THEN "Platba"
  WHEN ${event_name} = "purchase" THEN "Nákup"
  ELSE ${cart_events}
end`;
}
