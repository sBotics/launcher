let luxon = require('luxon');

class Time {
  constructor() {}
  ParseTime(filedate) {
    return luxon.DateTime.utc(
      parseInt(filedate.slice(0, 4)),
      parseInt(filedate.slice(5, 7)),
      parseInt(filedate.slice(8, 10)),
      parseInt(filedate.slice(11, 13)),
      parseInt(filedate.slice(14, 16)),
      parseInt(filedate.slice(17, 19)),
    ).toMillis();
  }
  ConvertTime(date) {
    let data = new Date(date);
    let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    var dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '');
    return `${dataBase}Z`;
  }
}
export { Time };
