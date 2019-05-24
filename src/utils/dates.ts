import * as moment from 'moment';
import { isEqualOr } from 'utils/functions';
import momentLocalizer from 'components/ui/input/date-picker/localizer';

moment.locale('ru');
momentLocalizer();

export const diffDates = (dateA, dateB, typeDiff = 'seconds', float = true) =>
  moment(dateA).diff(moment(dateB), typeDiff as any, float);

export const getDateWithMoscowTz = () => {
  const newDate = new Date();
  newDate.setTime(
    newDate.getTime() + (newDate.getTimezoneOffset() + 180) * 60 * 1000,
  );

  return newDate;
};

export const getDateWithMoscowTzByTimestamp = (timestamp) => {
  const newDate = new Date(timestamp);
  newDate.setTime(
    newDate.getTime() + (newDate.getTimezoneOffset() + 180) * 60 * 1000,
  );

  return newDate;
};
export const addSecond = (date, seconds) =>
  moment(date).add(seconds, 'seconds');

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
  return moment(date).format(
    `${global.APP_TIME_FORMAT}${withSeconds ? ':ss' : ''}`,
  );
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
  if (!date) {
    return null;
  }
  return moment(date).format('YYYY-MM-DD');
}

export function createValidDateHM(date) {
  if (!date) {
    return null;
  }
  return moment(date).format('YYYY.MM.DD HH:mm');
}

export function createValidDateTime(date) {
  if (!date) {
    return null;
  }
  return moment(date)
    .seconds(0)
    .format('YYYY-MM-DDTHH:mm:ss');
}

export function formatDate(date, format) {
  if (!date) {
    return null;
  }

  return moment(date).format(format);
}

export function getFormattedDateTime(date) {
  if (!date) {
    return '';
  }
  return moment(date).format(
    `${global.APP_DATE_FORMAT} ${global.APP_TIME_FORMAT}`,
  );
}

export function getFormattedDateTimeWithSecond(date) {
  if (!date) {
    return '';
  }
  return moment(date).format(
    `${global.APP_DATE_FORMAT} ${global.APP_TIME_WITH_SECOND_FORMAT}`,
  );
}

export function getFormattedTimeWithSecond(date) {
  if (!date) {
    return '';
  }
  return moment(date).format(`${global.APP_TIME_WITH_SECOND_FORMAT}`);
}

export function getFormattedDateTimeSeconds(date) {
  if (!date) {
    return '';
  }
  return moment(date).format(`${global.APP_DATE_FORMAT} HH:mm:ss`);
}

export function makeDateFromUnix(date) {
  if (!date) {
    return '-';
  }
  return moment.unix(date).format(`${global.APP_DATE_FORMAT} HH:mm:ss`);
}

export function makeUnixFromDate(date) {
  if (!date) {
    return -Infinity;
  }
  return moment(date).unix();
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

export function getYesterdayYesterday0am() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 0, 0);
}

export function getYesterdayYesterday2359() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 23, 59);
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

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    0,
    seconds,
  );
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

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    8,
    59,
    seconds,
  );
}

export function getTomorrow0am() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0);
}

export function makeDataFromRaw(date: string, time?: string, seconds?: string) {
  const [day, month, year] = date.split('.');

  let datetime = `${year}-${month}-${day}`;

  if (time) {
    datetime = `${datetime}T${time}:${seconds ? seconds : '00'}`;
  }

  return datetime;
}

export function isValidDate(date) {
  return moment(date).isValid();
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
  return `0${num}`.slice(-2);
}
export function secondsToTime(secs) {
  let mMinutes = Math.floor(secs / 60);
  const mSecs = secs % 60;
  const mHours = Math.floor(mMinutes / 60);
  mMinutes %= 60;
  return `${pad(mHours)}:${pad(mMinutes)}:${pad(mSecs)}`;
}

export const getCurrentSeason = (summer_start_date: string = null, summer_end_date: string = null) => {
  if (isEqualOr([summer_start_date, summer_end_date], null)) {
    return '';
  }

  const date = new Date();

  if (diffDates(date, summer_start_date) >= 0 && diffDates(summer_end_date, date) >= 0) {
    return 'summer';
  }

  return 'winter';
};

/**
 * @param {date | string} dataA - date start compare
 * @param {date | string} dataB - date end compare
 * @param {string} typeDiff - type compare (see moment .diff())
 */
export const setZeroSecondsToDate = (date) => moment(date).seconds(0);

export const addTime = (date, count, typeAdd) =>
  moment(date)
    .add(count, typeAdd)
    .format();

export const diffDayOfDate = (dateA, dateB) =>
  diffDates(moment(dateA).endOf('day'), moment(dateB).endOf('day'), 'days');

export const diffDatesByDays = (dateA, dateB) =>
  diffDates(createValidDate(dateA), createValidDate(dateB), 'days');

export const currentDateInInterval = ({ date_start, date_end }) =>
  diffDates(new Date(), date_start) > 0 && diffDates(new Date(), date_end) < 0;

export const monthOptions = Array(12).fill(0).map(
  (_, index) => {
    const monthName = moment().month(index).format('MMMM');

    return ({
      value: index + 1,
      label: monthName.charAt(0).toUpperCase() + monthName.substr(1),
    });
  },
);
