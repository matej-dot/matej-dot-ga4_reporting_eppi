module.exports = (version, campaign) => {

  return `
CASE
-- ================= CZ =================

-- New Google
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%SRCH_EPPI%" THEN "01 - CZ - BRA - Eppi"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%0 | BRA | EPPI | eCPC%" THEN "01 - CZ - BRA - Eppi"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%2 | SEA I General | ROAS%" THEN "02 - CZ - SEA - Kategorie"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%2 | SEA | Zlatnictví Praha | mClick%" THEN "02 - CZ - SEA - Zlatnictví Praha"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%SRCH - zlatnictví Praha%" THEN "02 - CZ - SEA - Zlatnictví Praha"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%SRCH_EPPI_Kategorie%" THEN "01 - CZ - BRA - Eppi kategorie"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%3 | SEA | Eppi Kategorie | eCPC%" THEN "01 - CZ - BRA - Eppi kategorie"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%Snubni-prsteny FO%" THEN "07 - CZ - PMAX - Snubní prsteny"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "% | PMX | Snubní prsteny FO | mKon%" THEN "07 - CZ - PMAX - Snubní prsteny"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%PLA I Cenové hladiny%" THEN "07 - CZ - PLA - Kategorie"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%CZ I DG I Průběžné akce I Bez feedu%" THEN "30 - CZ - DMG - Akce"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%DMG | Průběžné akce | Bez feedu | BRG | mKon%" THEN "30 - CZ - DMG - Akce"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%DMG I Průběžné akce I Bez feedu | BRG | mKon%" THEN "30 - CZ - DMG - Akce"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%DG_AKV_EPPI_Video_Bez-feedu%" THEN "30 - CZ - DMG - Video"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%8 | DMG | AKV_EPPI_Video | BRG | Bez-feedu | mClick%" THEN "30 - CZ - DMG - Video"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%SRCH I General%" THEN "02 - CZ - SEA - Kategorie"

-- Old Google
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%PMax - ALL - FO%" THEN "1 | PMX | Skladovky | ROAS"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%Hazelnut Gold%" THEN "1 | PMX | Hazelnut Gold | mKon"

-- Meta
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%5_REM_Narozeni ditete%" THEN "5_REM_Narození dítěte"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%akce prodejna snubni prsteny%" THEN "(H) Akce - snubni prsteny - podzim - prodeje 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%jantar - broad%" THEN "(H) Jantar - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%wca-30-proc-nakupovat%" THEN "wca-30-proc nakupovat"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%wca-30-trendy%" THEN "wca-30-trendy"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%promo post - broad%" THEN "(H) | BRG | - dosah - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%all-14%" THEN "dynamicky-remarketing"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%reels - 4v1 ženy%" THEN "(H) | BRG | - Reels - thruplay - srpen - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%broad-konverze-post-mix%" THEN "core-cbo-7 1-akv"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%brand promo - IG%" THEN "(H) | BRG | - dosah - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%brand promo - FB%" THEN "(H) | BRG | - dosah - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%brand promo - (reach%" THEN "(H) | BRG | - dosah - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%zasnubni prsteny - muzi%" THEN "(H) zasnubni prsteny - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%Advantage%" AND ${campaign} LIKE "%nákupní%" THEN "zasnubni-prsteny-akv-adv"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%obecne-usp-banenry%" THEN "core-cbo-7 1-akv"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%akce eshop snubni prsteny%" THEN "(H) Akce - snubni prsteny - podzim - prodeje 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%klidne vanoce - ban%" THEN "(H) Klidné Vánoce - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%klidne vanoce - vid%" THEN "(H) Klidné Vánoce - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%lastcall eshop snubni prsteny%" THEN "(H) Akce - snubni prsteny - podzim - prodeje 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%klidne vanoce - LC ban%" THEN "(H) Klidné Vánoce - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%hazelnut gold - broad%" THEN "(H) hazelnut gold - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%maly princ%" THEN "(H) Maly princ - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%zodiac - broad%" THEN "(H) zodiac - prodeje - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%prsteny - prodejna - lead%" THEN "(H) prsteny - prodejna - lead - 2025"
WHEN '${version}' = "eppi_cz" AND ${campaign} LIKE "%snubni prsteny - prodejna - zajmy%" THEN "(H) prsteny - prodejna - lead - 2025"

-- ================= SK =================

-- New Google
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%SRCH_EPPI%" THEN "01 - SK - BRA - Eppi"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%0 | BRA | EPPI | eCPC%" THEN "01 - SK - BRA - Eppi"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%0 | BRA | EPPI_Kategorie | eCPC%" THEN "01 - SK - BRA - Eppi kategorie"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%PLA_LOW_Zombie%" THEN "07 - SK - PLA - Eppi"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%1 | PLA | LOW_Zombie | ROAS%" THEN "07 - SK - PLA - Eppi"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%PMax - ALL - FO%" THEN "07 - SK - PMAX"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%1 | PMX | ALL - FO | ROAS%" THEN "07 - SK - PMAX"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%SK I PLA I Catch-all%" THEN "07 - SK - PLA - Kategorie"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%1 | PLA | Skladovky | ROAS%" THEN "07 - SK - PLA - Kategorie"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%1 I PLA I Skladovky | ROAS%" THEN "07 - SK - PLA - Kategorie"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%SRCH - Narození dítěte%" THEN "02 - SK - SEA - Kategorie"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%3 | SEA | Narození dítěte | mKon%" THEN "02 - SK - SEA - Kategorie"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%SK I DG I Průběžné akce I Bez feedu%" THEN "30 - SK - DMG - Akce"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%8 | DMG | Průběžné akce | Bez feedu | mKon%" THEN "30 - SK - DMG - Akce"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%8 I DMG I Průběžné akce I Bez feedu | mKon%" THEN "30 - SK - DMG - Akce"

-- Old Google
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%Hazelnut gold%" THEN "1 | PMX | Hazelnut gold | mKon"

-- Meta
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%zasnubni prsteny - prodejna - zajmy%" THEN "(H) | BRG | prsteny - prodejna - ThruPlay - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%promo post - zajmy - (eng%" THEN "(H) | BRG | - engagement - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%maly princ - broad%" THEN "(H) Maly princ - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%zajmy-bratislava-tp-ig%" THEN "| BRG | prodejna-tp-brand"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%snubni prsteny - prodejna - zajmy%" THEN "(H) | BRG | prsteny - prodejna - ThruPlay - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%promo post - zajmy - (pur 7 1%" THEN "(H) Promo post - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%zasnubni prsteny - muzi%" THEN "(H) zasnubni prsteny - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%wca-30-trendy%" THEN "| BRG | remarketingova-sekvence-brand"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%reels - zajmy ženy%" THEN "(H) | BRG | - Reels - thruplay - srpen - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%broad-hodnota-vse%" THEN "videa-zlatik-vyroba-5-25-akv"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%all-14%" THEN "dynamicky-remarketing"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%zodiac - broad%" THEN "(H) zodiac - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%hazelnut gold - broad%" THEN "(H) hazelnut gold - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%akce eshop snubni prsteny%" THEN "(H) Akce - snubni prsteny - podzim - prodeje 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%jantar - broad%" THEN "(H) Jantar - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%klidne vanoce - ban%" THEN "(H) Klidné Vánoce - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%klidne vanoce - vid%" THEN "(H) Klidné Vánoce - prodeje - 2025"
WHEN '${version}' = "eppi_sk" AND ${campaign} LIKE "%lastcall eshop snubni prsteny%" THEN "(H) Akce - snubni prsteny - podzim - prodeje 2025"

-- ================= DE =================

WHEN '${version}' = "eppi_de" AND ${campaign} LIKE "%PER_PMAX_MIX_DE~Eppi_Shopping%" THEN "07 - DE - PMAX - Kategorie"
WHEN '${version}' = "eppi_de" AND ${campaign} LIKE "%PER_SEA_KW_DE~Eppi_Brand%" THEN "01 - DE - BRA - Eppi"
WHEN '${version}' = "eppi_de" AND ${campaign} LIKE "%PER_SEA_KW_DE~Eppi_rings%" THEN "01 - DE - BRA - Eppi kategorie"

ELSE TRIM(REPLACE(REPLACE(REPLACE(REPLACE(${campaign}, "+", " "),"  "," ")," I "," | "),"Průbězná","Průbězné"))
END
`;}