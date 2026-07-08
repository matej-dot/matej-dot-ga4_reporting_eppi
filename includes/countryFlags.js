module.exports = (domain) => {
  return `
(
SELECT
  flag_url
FROM
  \`gtm-ntxrpzps-ywm3z.country_information.loaded_csv_country_information\` 
WHERE 
  ARRAY_REVERSE(SPLIT("${domain}", '_'))[OFFSET(0)] = lower(alpha_2_code)
)
`;
}
