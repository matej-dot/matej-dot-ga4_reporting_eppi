module.exports = (source,medium,campaign) => {

const sourceMedium = 'CONCAT(' + source + ',  " / " ,' + medium + ')' 
  
  return `
CASE
  WHEN REGEXP_CONTAINS(${medium},".*ec.*") THEN "Externí náklady"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*google / cpc.*") AND NOT REGEXP_CONTAINS(${campaign}, "(?i).*organic.*") THEN "Google Ads"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*anonymized / anonymized.*") THEN "Anonymized"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*zbozi.cz.*") OR 
    REGEXP_CONTAINS(${campaign}, "(?i).*zboží.*") THEN "Zboží.cz"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*seznam / cpc.*") OR 
    REGEXP_CONTAINS(${sourceMedium}, "(?i).*sklik / cpc.*") THEN "Sklik"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*sms.*") THEN "SMS"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*favi.*") THEN "Favi"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*glami.*") THEN "Glami"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*biano.*") THEN "Biano"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*firmy.*") THEN "Firmy.cz"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*bing / cpc.*") THEN "Bing Ads"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*heureka.*") THEN "Heuréka"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*acebook.*") AND 
    REGEXP_CONTAINS(${medium}, "(?i).*cpc.*") THEN "Facebook"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*acebook.*") THEN "Facebook"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*fcb.*") OR REGEXP_CONTAINS(${sourceMedium}, "(?i).*fb.*") THEN "Facebook"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*zbozi.*") THEN "Zboží.cz"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*cj.*") THEN "CJ"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*rtb.*") THEN "RTB"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*dognet.*") THEN "Dognet"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*leadhub.*") THEN "Leadhub"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*wau.*") THEN "Wau"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*email.*") OR
    REGEXP_CONTAINS(${sourceMedium}, "(?i).*e-mail.*")THEN "Emailing"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*direct.*") THEN "Direct"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*organic.*") OR REGEXP_CONTAINS(${campaign}, "(?i).*organic.*") THEN "Organic"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*referral.*") THEN "Referral"
  ELSE "Ostatní"
end`;
}
