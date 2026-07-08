module.exports = (source, medium, campaign) => {
  return `
CASE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PLA | Cenové hladiny | ROAS" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PMX | ALL - FO | ROAS" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PMX | Skladovky | ROAS" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "3 | SEA | Eppi Kategorie | eCPC" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "core-cbo-7 1-akv" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "9 | RMK | DYN" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_PMAX_MIX_DE~Eppi_Shopping" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "2 | SEA | General | ROAS" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "0 | BRA | EPPI | eCPC" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zasnubni-prsteny-akv-adv" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "8 | DMG | Průběžné akce | Bez feedu | BRG | mKon" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) zasnubni prsteny - prodeje - 2025" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) prsteny - prodejna - lead - 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PLA | Skladovky | ROAS" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "dynamicky-remarketing" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) Maly princ - prodeje - 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_Brand" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "videa-zlatik-vyroba-5-25-akv" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-recenze-1-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "EPPI-DE-Advantage _Maly-princ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) Akce - snubni prsteny - podzim - prodeje 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_PMAX_MIX_DE~Eppi" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) | BRG | - Reels - thruplay - srpen - 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_DSA_DE~Eppi_All-Pages" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "EPPI-DE-Advantage _Zasnubni-prsteny Sada reklam" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) Klidné Vánoce - prodeje - 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_earrings" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "4 | SEA | Snubní prsteny | mKon" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-bannery" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) | BRG | - dosah - 2025" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-gen" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "3 | SEA | Zasnubní prsteny | mKon" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "8 | DMG | Průběžné akce | Bez feedu | mKon" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) zodiac - prodeje - 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_rings" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "EPPI-SK-Advantage Maly-princ Sada reklam" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-prispevky-1-25" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PMX | Snubní prsteny FO | mKon" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-maly-princ-1-25" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PMX | Profitable-produkty | ROAS" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-post-znameni-vodnar-1-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "02/09/25 - maly princ - broad - (pur 7 1) - DE" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "02/09/25 - zasnubni prsteny - muzi - zajmy - (pur 7 1) - DE" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "3 | SEA | Narození dítěte | mKon" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "EPPI - SK- Snubní prsteny - new Sada reklam" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-maly-princ-reels-5-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) | BRG | prsteny - prodejna - ThruPlay - 2025" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "EPPI - SK - Zásnubní prsteny - new Sada reklam" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) Jantar - prodeje - 2025" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) hazelnut gold - prodeje - 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PMX | Hazelnut Gold | mKon" THEN TRUE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "5_REM - dynamika (PC)" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PMX | Hazelnut gold | mKon" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "04/08/25 - promo post - zajmy - (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-zimni-banner-1-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-maly-princ-bannery-1-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/07/25 - daba - broad (zds) DE" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1-reels-maly-princ-5-25" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "0 | BRA | EPPI_Kategorie | eCPC" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "X_PER_SEA_KW_DE~Eppi_Birth-Jewelry" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/07/25 - vc atc 7d - (pur 7 1) - DE" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PLA | Profitable-products | ROAS" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMax - Zasnubni-prsteny FO 8-15" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-vse-hodnota-bannery" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "| BRG | prodejna-tp-brand" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Advantage hodnota" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "CZ | YT | Brand videa" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "28/07/25 - snubni prsteny - zajmy - (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "8 | DMG | AKV_EPPI_Video | BRG | Bez-feedu | mClick" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_REM_MIX_DE~Remarketing" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "(H) | BRG | - engagement - 2025" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-znameni-byk-4-25-ig" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_jewelry-set" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PLA | LOW_Zombie | ROAS" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_PMAX_MIX_DE~Eppi_All" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMAX_Kolekce_Maly-princ" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-partner-ads" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "PLA - Zboží.cz: Eppi" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-gen" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1-reels-fashio-sperky-4-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-hodnota-maly-princ-reels-5-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - broad hod (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-kristina-krajcirova-5-25-ig" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "24/06/25 - brand promo - (reach) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-hodnota" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_bracelet" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "14/07/25 - heppi days - hod - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-zasnubni-prsteny-reels-5-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-bannery" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-hodnota-zasnubni-prsteny-reels-5-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - daba broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - daba broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - vid - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "04/09/25 - snubni prsteny - broad - (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1-bannery" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - vid - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - daba - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "CZ | PLA | Catch-All" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-konverze-gen" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "wca-30-trendy" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_PMAX_BlackFriday_DE~Eppi" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - ban - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-reels-fashio-sperky-4-25" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "5_REM_Narození dítěte" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - ban - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-zasnubni-prsteny-1-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-post-znameni-berana-3-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "16/06/25 - maly princ - ban - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "CZ | PMAX | Upper-funnel" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "14/07/25 - heppi days - daba - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1-reels-snubni-prsteny-4-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-tp" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "14/07/25 - heppi days - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - prvni varka - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - druha varka - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - prvni varka - hod - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "| BRG | remarketingova-sekvence-brand" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - daba - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_PLA_KW_DE~Eppi_Price-Levels" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - videa - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - druha varka - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - prvni varka - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-video-snubni-prsteny-3-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1-reels-zasnubni-prsteny-4-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "19/11/25 - promo post - zajmy - (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "DE | DG | Průběžné akce | Bez fedu" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "EPPI-CZ-Advantage campaign_maly-princ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-post-znameni-ryb-2-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "wca-30-proc nakupovat" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-hodnota-snubni-prsteny-reels-5-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-videa-zena text" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-inlfu" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "8 | DIS | Průběžné akce | eCPC DESKTOP" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "wca-30-proc-nakupovat" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - daba - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "01/10/25 - heppi bday (reach) - Praha" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "01/10/25 - heppi bday (zds) - Praha" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-vse-hodnota-gen" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "04/08/25 - promo post - zajmy - (eng) - CR" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_rings _Max conv" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - 4v1 (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "9 | RMK | Dynamicky banner (kategorie) | eCPC" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vc" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "06/11/25 - promo post - zajmy - (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "SDN | REM | Valentýn 2025" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMax_Snubni-prsteny_FO_Form" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PLA_Snubni-prsteny" THEN TRUE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_little-prince" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_engagement-rings" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "akv-broad-Maly-princ-hodnota" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - broad hod (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "30/11/25 - black friday - prodlouzeni mix - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "DE | DG | Průběžné akce | Feed" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMAX_Zero-Conversion-produkty" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad - hodnota" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - vid- broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - ban - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - vid - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-nikoleta-s-5-25-ig" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMax - ALL - Kreativy" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-vc-7 1" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMax - Snubni-prsteny FO" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "30/11/25 - black friday - prodlouzeni - ban - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "30/11/25 - black friday - prodlouzeni - vid - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "10/11/25 - promo post - zajmy - (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-snubni-prsteny-reels-5-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-bannery-vc" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - daba broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - videa - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "DIS_REM_Sleva-15%_Zasnubni-prsteny" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "DISP_REM_USP" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - daba - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "14/07/25 - heppi days - daba broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-vse-vc-druhe-video" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMAX_Costly-produkty" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - LC mix - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-videa" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - LC mix - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PMax - Zasnubni-prsteny FO" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "15/09/25 - heppi days - influ - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - daba - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Instagram Post" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "rem-vse-hodnota-bannery" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "1 | PLA | Zombie_Low | ROAS" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-sona-fr-5-25-ig" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_pendants/necklaces" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1-vc-bannery" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-post-znameni-byk-4-25" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "DISP_REM_Den-matek_2025" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-reels-zasnubni-prsteny-4-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "30/11/25 - black friday - prodlouzeni - daba - broad (pur 7 1) CZ" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "11/08/25 - vicjelip - broad hod skladovky (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "15/09/25 - heppi days - influ - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-7 1-gen" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-vse-hodnota-vid" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-snubni-prsteny-4-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-vse-vc-bannery" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "akv-broad" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-post-partner" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-ig-visits" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - ban - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "2 | SEA | EPPI Kategorie | eCPC" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "12/09/25 - heppi days - druha varka - hod - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "ig-visits-inlfu-videa-samostatne" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "8 | BRG | Zasnubni prsteny_Sleva-15%_05/25" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_products" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "01/10/25 - heppi bday (událost eng) - Praha" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-den-matek-5-25" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_wedding-rings" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_little-prince little prince| conv value vs max clicks" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "22/09/25 - heppi days podzim last call - heppi days last call - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/07/25 - heppi days last call - hod - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "22/09/25 - heppi days last call - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/07/25 - heppi days last call - daba - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "20/11/25 - black friday - LC mix - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_birth-jewelry" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "06/11/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "06/11/25 - brand promo - FB - (interakce) - SK" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "0 | BRA | EPPI | eCPC" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-influ-sweetlady-4-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-iveta-kopernicka-5-25-ig" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "08/12/25 - promo post - zajmy - (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-muzi-ig" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "2 | SEA | Zlatnictví Praha | mClick" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-muzi-fb" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "18/06/25 - prodejna bratislava - zajmy (reach) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-videa-samostatne" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-vse-vc-vid" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-vid" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "22/09/25 - heppi days podzim last call - daba - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-post-mdz-3-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-znameni-byk-4-25" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "DIS_REM_hEPPI-Days_04/25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "14/07/25 - heppi days - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/07/25 - heppi days - broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/07/25 - heppi days - daba broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-videa-muz text" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/07/25 - heppi days last call - broad (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-tp-partner" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "PER_SEA_KW_DE~Eppi_mens-jewelry" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "25/08/25 - vicjelip - last call broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "25/08/25 - vicjelip last call - broad hod (pur 7 1) - CR" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "22/09/25 - heppi days last call - daba broad (pur 7 1) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "akv - broad" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "01/11/25 - klidne vanoce - LC ban - broad (pur 7 1) SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "all-14" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "purchase-180-db" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "25/11/25 - brand promo - FB - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "25/11/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "04/12/25 - brand promo - FB - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "rem-vse-hodnota-gen" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-vid" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "19/11/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "19/11/25 - brand promo - FB - (interakce) - SK" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "2_SEA - minimalisticke sperky" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-partner-ads" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "04/12/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-vse-vc-post" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "SRCH - Brand low-cpc" THEN TRUE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/11/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "21/11/25 - brand promo - FB - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "13/11/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "rem" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-hodnota-reels-4-25" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "SRCH - Malý princ" THEN FALSE
WHEN ${source} = "google" AND ${medium} = "cpc" AND ${campaign} = "SRCH - Narození dítěte" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-tp-5-25-influ-kristina-krajcirova" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-tp-5-25-influ-iveta-kopernicka" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-vse-hodnota-tatiana-jelinek-partner-ad" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Interakcie s príspevkom Reklama: Šperky pre Blížencov – dvojaké duše, jeden štýl ♊" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Príspevok: „💍 Zlato vs. Striebro“" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "rem-broad-ig-eng" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "26/11/25 - brand promo - FB - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Príspevok: „🎊 hEPPI DAYS sú späť – a prichádzajú s novou...“" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-wca-180-reach-fb" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-reach-ig" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-tp-5-25-influ-nikoleta-s" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Interakcie s príspevkom Reklama: 🎉 Hráme sa o naše bestsellerové náušnice Torcy!" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-tp-5-25-influ-sona-fr" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Interakcie s príspevkom Reklama: 🎁 Nestihli ste darček pre maminu?" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Pozretia videa Reklama: „Dobre vidíme iba srdcom.“ 💫" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-tp-5-25" THEN FALSE
WHEN ${source} = "seznam" AND ${medium} = "cpc" AND ${campaign} = "2_SEA - karbon" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "26/11/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-wca-180-reach-fb-2" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-wca-180-reach-fb-3" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-reach-ig-2" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "zajmy-reach-ig-3" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "rem-vse-hodnota-videa-zena text" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-den-matek-5-25-ig" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "02/12/25 - brand promo - FB - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "02/12/25 - brand promo - IG - (interakce) - SK" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "broad-konverze-snubni-prsteny-post-5-25" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "Interakcie s príspevkom Reklama: ♉ Vitaj, Býk!" THEN FALSE
WHEN ${source} = "facebook" AND ${medium} = "cpc" AND ${campaign} = "3/12/25 - vic darku - LC mix - broad (pur 7 1) SK" THEN FALSE

ELSE NULL

END
`;
};