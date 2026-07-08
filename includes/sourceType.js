module.exports = (source,medium,campaign) => {

const sourceMedium = 'CONCAT(' + source + ',  " / " ,' + medium + ')'  
  
  return `
CASE
  WHEN REGEXP_CONTAINS(${medium},".*ec.*") THEN "Externí náklady"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*zbozi.cz.*") OR 
    REGEXP_CONTAINS(${campaign}, "(?i).*zboží.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*anonymized / anonymized.*") THEN "Anonymized"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*google / cpc.*") AND 
    REGEXP_CONTAINS(replace(${campaign}," ",""), "01-.*") AND NOT REGEXP_CONTAINS(${campaign}, "(?i).*organic.*") THEN "Placený / Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*google / cpc.*") AND NOT REGEXP_CONTAINS(${campaign}, "(?i).*organic.*") THEN "Placený / Non Brand"
  WHEN (REGEXP_CONTAINS(${sourceMedium}, "(?i).*seznam / cpc.*") OR 
    REGEXP_CONTAINS(${sourceMedium}, "(?i).*sklik / cpc.*")) AND 
    REGEXP_CONTAINS(replace(${campaign}," ",""), "01-.*") THEN "Placený / Brand"
  WHEN (REGEXP_CONTAINS(${sourceMedium}, "(?i).*seznam / cpc.*") OR 
    REGEXP_CONTAINS(${sourceMedium}, "(?i).*sklik / cpc.*")) THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*bing / cpc.*") AND 
    REGEXP_CONTAINS(replace(${campaign}," ",""), "01-.*") THEN "Placený / Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*bing / cpc.*") THEN "Placený / Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*zbozi.*") OR 
    REGEXP_CONTAINS(${campaign}, "(?i).*zboží.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*sms.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*favi.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*glami.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*biano.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*firmy.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*heureka.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*acebook.*") AND 
    REGEXP_CONTAINS(${medium}, "(?i).*cpc.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*fb.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*cj.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*rtb.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*dognet.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*wau.*") THEN "Placený / Non Brand"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*email.*") OR
    REGEXP_CONTAINS(${sourceMedium}, "(?i).*e-mail.*")THEN "Organický"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*acebook.*") THEN "Organický"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*direct.*") THEN "Direct"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*organic.*") OR REGEXP_CONTAINS(${campaign}, "(?i).*organic.*") THEN "Organický"
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*referral.*") THEN "Organický"
  ELSE "Organický"
end`;
}
