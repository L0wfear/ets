import moment from 'moment';
import { isEqualOr } from './functions';

export const getDateWithMoscowTz = (...dateProps) => {
  const newDate = new Date(...dateProps);
  newDate.setTime(newDate.getTime() + ((newDate.getTimezoneOffset() + 180) * 60 * 1000));

  return newDate;
};

export const addSecond = (date, seconds) => (
  moment(date).add(seconds, 'seconds')
);

export function makeDate(date) {
  return moment(date).format(`${global.APP_DATE_FORMAT}`);
}

export function makeUnixTime(time) {
  if (typeof time === 'string') {
    time = moment(time).toDate();
  }
  return Math.floor(time / 1000);
}

export function makeTime(date, withSeconds = false) {
  date = new Date(date);
  return moment(date).format(`${global.APP_TIME_FORMAT}${withSeconds ? ':ss' : ''}`);
}

export function makeMinutes(date) {
  date = new Date(date);
  return moment(date).format('mm:ss');
}

export function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function createValidDate(date) {
  if (!date) return null;
  return moment(date).format('YYYY-MM-DD');
}

export function createValidDateTime(date) {
  if (!date) return null;
  return moment(date).seconds(0).format('YYYY-MM-DDTHH:mm:ss');
}

export function getFormattedDateTime(date) {
  if (!date) return '';
  return moment(date).format(`${global.APP_DATE_FORMAT} ${global.APP_TIME_FORMAT}`);
}

export function getFormattedDateTimeSeconds(date) {
  if (!date) return '';
  return moment(date).format(`${global.APP_DATE_FORMAT} HH:mm:ss`);
}

export function makeDateFromUnix(date) {
  if (!date) return '-';
  return moment.unix(date).format(`${global.APP_DATE_FORMAT} HH:mm:ss`);
}

// смены за вчера, сегодня, завтра

export function getYesterday0am() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0);
}

export function getYesterday2359() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59);
}

export function getYesterday9am() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 0);
}

export function getDate9am(date) {
  const now = new Date(date);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0);
}

export function getNextDay859am(date) {
  const now = new Date(date);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 59);
}

export function getToday9am(seconds = 0) {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, seconds);
}

export function getToday859am() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 59);
}

export function getToday0am() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
}

export function getToday2359() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59);
}

export function getTomorrow9am(seconds = 0) {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 59, seconds);
}

export function getDatesByShift() {
  const now = new Date();
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

function pad(num) {
  return (`0${num}`).slice(-2);
}
export function secondsToTime(secs) {
  let m_minutes = Math.floor(secs / 60);
  const m_secs = secs % 60;
  const m_hours = Math.floor(m_minutes / 60);
  m_minutes %= 60;
  return `${pad(m_hours)}:${pad(m_minutes)}:${pad(m_secs)}`;
}

export const getCurrentSeason = (summerStart = null, summerEnd = null) => {
  if (isEqualOr([summerStart, summerEnd], null)) {
    return '';
  }

  const date = new Date();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth();

  const [summerStartMonth, summerStartDay] = summerStart;
  const [summerEndMonth, summerEndDay] = summerEnd;

  const isLessOrEqualThanEnd = currentMonth <= summerEndMonth && currentDay <= summerEndDay;
  const isBiggerOrEqualThanStart = currentMonth >= summerStartMonth && currentDay >= summerStartDay;

  if (isLessOrEqualThanEnd && isBiggerOrEqualThanStart) {
    return 'summer';
  }

  return 'winter';
};

/**
 * @param {date | string} dataA - date start compare
 * @param {date | string} dataB - date end compare
 * @param {string} typeDiff - type compare (see moment .diff())
 */
export const setZeroSecondsToDate = date => moment(date).seconds(0);

export const diffDates = (dateA, dateB, typeDiff = 'seconds', float = true) =>
  moment(dateA).diff(moment(dateB), typeDiff, float);

export const addTime = (date, count, typeAdd) => moment(date).add(count, typeAdd).format();

export const diffDayOfDate = (dateA, dateB) =>
  diffDates(moment(dateA).endOf('day'), moment(dateB).endOf('day'), 'days');

export const diffDatesByDays = (dateA, dateB) =>
  diffDates(
    createValidDate(dateA),
    createValidDate(dateB),
    'days',
  );
