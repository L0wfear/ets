import moment from 'moment';

let twoDigits = (n) => n < 10 ? '0' + n : n;

export function makeDate(date) {
  return moment(date).format(`${global.APP_DATE_FORMAT}`);//twoDigits(date.getDate()) + '.' + twoDigits(date.getMonth() + 1) + '.' + date.getFullYear();
}

export function makeUnixTime(time) {
	return Math.floor(time / 1000);
}

export function makeTime(date, withSeconds = false) {
  date = new Date(date);
  return twoDigits(date.getHours()) + ':' + twoDigits(date.getMinutes()) + (withSeconds ? ':' + twoDigits(date.getSeconds()) : '')
}

export function getStartOfToday() {
  let now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// ^ deprecated ?

export function createValidDate(date){
  if (!date) return null;
  return moment(date).format('YYYY-MM-DD');
}

export function createValidDateTime(date){
  if (!date) return null;
  return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

export function getFormattedDateTime(date){
  if (!date) return '';
  return moment.utc(date).format(`${global.APP_DATE_FORMAT} HH:mm`);
}

export function getFormattedDateTimeSeconds(date){
  if (!date) return '';
  return moment(date).format(`${global.APP_DATE_FORMAT} HH:mm:ss`);
}

export function getToday9am() {
  let now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0);
}

export function getTomorrow9am() {
  let now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 59);
}

export function getToday0am() {
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
}

export function getToday2359() {
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
}

export function getDatesByShift() {
  let now = new Date();
  if (now.getHours() > 18) {
    return [
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0),
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 7, 0),
    ];
  }
  return [
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0),
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0),
  ];
}

// export function getDateWithoutTZ(date, format = true) {
// 	if (typeof date === 'string') date = date.replace('.000000Z', '');
// 	date = moment(date).toDate();
// 	return date;
// }; Н Е Н У Ж Н О
