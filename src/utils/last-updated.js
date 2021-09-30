const luxon = require('luxon');

const ParseTime = (filedate) => {
  const year = parseInt(filedate.slice(0, 4));
  const month = parseInt(filedate.slice(5, 7));
  const day = parseInt(filedate.slice(8, 10));
  const hour = parseInt(filedate.slice(11, 13));
  const minute = parseInt(filedate.slice(14, 16));
  const second = parseInt(filedate.slice(17, 19));
  const date = luxon.DateTime.utc(year, month, day, hour, minute, second);
  return date.toMillis();
};
const ConvertTime = (date) => {
  let data = new Date(date);
  let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
  var dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');
  return `${dataBase}Z`;
}
export { ParseTime, ConvertTime }
