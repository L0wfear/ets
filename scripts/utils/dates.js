import moment from 'moment';

let twoDigits = (n) => n < 10 ? '0' + n : n;

export function makeDate(date) {
  return date.getFullYear() + '-' + twoDigits(date.getMonth() + 1) + '-' + twoDigits(date.getDate())
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
  return moment(date).format('YYYY-MM-DD');
}

export function createValidDateTime(date){
  return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

export function getFormattedDateTime(date){
  if (!date) return '';
  return moment.utc(date).format('YYYY-MM-DD HH:mm');
}

export function getToday9am() {
  let now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0);
}

export function getTomorrow9am() {
  let now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0);
}

export function getDateWithoutTZ(date, format = true) {
	if (typeof date === 'string') date = date.replace('.000000Z', '');
	date = moment(date).toDate();
	return date;
};
