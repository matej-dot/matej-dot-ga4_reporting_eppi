module.exports = (date) => {
  return `
CASE
  WHEN EXTRACT(DAY FROM ${date}) < 11 THEN "1. až 10. den"
  WHEN EXTRACT(DAY FROM ${date}) > 10 AND EXTRACT(DAY FROM ${date}) < 21 THEN "10. až 20. den"
  WHEN EXTRACT(DAY FROM ${date}) > 20 THEN "20. až 30. den"
end`;
}
