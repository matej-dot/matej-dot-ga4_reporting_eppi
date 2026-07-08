module.exports = (source,medium,campaign) => {

const sourceMedium = 'CONCAT(' + source + ',  " / " ,' + medium + ')' 

  return `
CASE
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*organic.*") THEN ${sourceMedium}
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*direct.*") THEN null
  WHEN REGEXP_CONTAINS(${sourceMedium}, "(?i).*referral.*") THEN ${sourceMedium}
  WHEN REGEXP_CONTAINS(${campaign}, "(?i).*organic.*") THEN null
  WHEN REGEXP_CONTAINS(${campaign}, "(?i).*direct.*") THEN null
  WHEN REGEXP_CONTAINS(${campaign}, "(?i).*referral.*") THEN null
  ELSE ${campaign}
END
`;
}
