module.exports = (event_name) => {
  return `
CASE
  WHEN ${event_name} = "page_view" THEN "Zobrazení stránky"
  WHEN ${event_name} = "session_start" THEN "1. Zahájení relace"
  WHEN ${event_name} = "view_item" THEN "2 . Zobrazení produktu"
  WHEN ${event_name} = "add_to_cart" THEN "3 . Přidání do košíku"
  WHEN ${event_name} = "remove_from_cart" THEN "4. Odebrání z košíku"
  WHEN ${event_name} = "begin_checkout" THEN "5. Vstup do procesu košíku"
  WHEN ${event_name} = "purchase" THEN "6. Nákup"
end`;
}