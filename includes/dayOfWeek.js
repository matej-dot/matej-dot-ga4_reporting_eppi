module.exports = (date) => {
  return `
  case
    when FORMAT_DATE('%A',${date}) = "Monday" THEN "1.Pondělí"
    when FORMAT_DATE('%A',${date}) = "Tuesday" THEN "2.Úterý"
    when FORMAT_DATE('%A',${date}) = "Wednesday" THEN "3.Středa"
    when FORMAT_DATE('%A',${date}) = "Thursday" THEN "4.Čtrvtek"
    when FORMAT_DATE('%A',${date}) = "Friday" THEN "5.Pátek"
    when FORMAT_DATE('%A',${date}) = "Saturday" THEN "6.Sobota"
    when FORMAT_DATE('%A',${date}) = "Sunday" THEN "7.Neděle"
  end`;
}

