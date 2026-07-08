module.exports = (date,currency) => {
  return `
(
SELECT
  CASE
    WHEN COUNT(*) > 0 THEN 1 / MAX(rate)
    ELSE 1 / (SELECT rate FROM \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` WHERE CODE = "${currency}" ORDER BY DATE ASC LIMIT 1)
  END AS rate
FROM
  \`gtm-ntxrpzps-ywm3z.exchange_rates.daily_rates_*\` 
WHERE 
  PARSE_DATE("%Y-%m-%d",date) = ${date} AND
  code = "${currency}"
)
`;
}
