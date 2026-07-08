module.exports = (source,medium,campaign) => {
  return `
CASE
  WHEN ${campaign} = "(organic)" THEN CONCAT(IFNULL(${source},"(unknown)")," / organic")
  WHEN ${campaign} = "(referral)" THEN CONCAT(IFNULL(${source},"(unknown)")," / referral")
  WHEN ${campaign} = "(direct)" OR ${campaign} IS NULL THEN "(direct) / (none)"
  WHEN REGEXP_CONTAINS(${campaign},"Zboží.cz.*") THEN "zbozi.cz / cpc"
  WHEN REGEXP_CONTAINS(${campaign},"firmy.cz.*") THEN "firmy.cz / ppd"
  ELSE CONCAT(IFNULL(${source},"(unknown)")," / ",IFNULL(${medium},"(unknown)"))
end`;
}
