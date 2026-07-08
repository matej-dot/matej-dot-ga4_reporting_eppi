module.exports = (event_name) => {
  return `
CASE
  WHEN ${event_name} = "page_view" THEN "Zobrazení stránky"
  WHEN ${event_name} = "view_item_list" THEN "Kategorie"
  WHEN ${event_name} = "view_item" THEN "Produkt"
  WHEN ${event_name} = "add_to_cart" THEN "Přidání do košíku"
  WHEN ${event_name} = "begin_checkout" THEN "Vstup do košíku"
  WHEN ${event_name} = "purchase" THEN "Nákup"
  ELSE ${event_name}
END`;
}
