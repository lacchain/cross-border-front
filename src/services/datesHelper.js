export const datesHelper = {
  monthDiff,
  formatDate
};

function monthDiff(date1, date2) {
    let months;
    let d1 = new Date(date1);
    let d2 = new Date(date2);
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() ;
    months += d2.getMonth();

    return months <= 0 ? 0 : months;
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
