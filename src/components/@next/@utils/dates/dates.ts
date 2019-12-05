import * as Moment from 'moment';

import momentLocalizer from 'components/@next/@utils/dates/localizer';

import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
momentLocalizer();

/**
 * Вычисляет разницу в typeDiff между датами
 * @param dateA Первая дата
 * @param dateB Вторая дата
 * @param typeDiff Тип разницы
 * @param float Точное ли сравнение | true - вернёт дробный ответ, false - целый, окгруглённый в меньшую сторону
 * @return number разницу между датами
 */
export const diffDates = (
  dateA?: Moment.MomentInput,
  dateB?: Moment.MomentInput,
  typeDiff: 'seconds' | 'hours' | 'minutes' | 'days' | 'months' = 'seconds', // Moment.unitOfTime.Diff = 'seconds',
  float: boolean = true,
): number => {
  return moment(dateA).diff(moment(dateB), typeDiff, float);
};

export const isCrossDates = (
  first_date_start: Moment.Moment | Date | string,
  first_date_end: Moment.Moment | Date | string,
  second_date_start: Moment.Moment | Date | string,
  second_date_end: Moment.Moment | Date | string,
) => {
  if (!first_date_start || !first_date_end || !second_date_start || !second_date_end) {
    return false;
  }
  const range_first_date = moment.range(moment(first_date_start), moment(first_date_end));
  const range_second_date = moment.range(moment(second_date_start), moment(second_date_end));

  return range_first_date.overlaps(range_second_date);
};

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
export const addSecond = (date: string | Date, seconds: number) =>
  moment(date).add(seconds, 'seconds');

export function makeDate(date) {
  return moment(date).format(`${global.APP_DATE_FORMAT}`);
}

export function makeUnixTime(timeOwn) {
  let time = timeOwn;
  if (typeof time === 'string') {
    time = moment(time).toDate();
  }
  return Math.floor(time / 1000);
}

export function makeTime(dateOwn: string | Date, withSeconds?: boolean) {
  let date = new Date(dateOwn);
  return moment(date).format(
    `${global.APP_TIME_FORMAT}${withSeconds ? ':ss' : ''}`,
  );
}

export function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function createValidDate(date: string | Date) {
  if (!date) {
    return null;
  }
  return moment(date).format('YYYY-MM-DD');
}

export function createValidDateDots(date: string | Date) {
  if (!date) {
    return null;
  }
  return moment(date).format('DD.MM.YYYY');
}

export function createValidDateHM(date: string | Date) {
  if (!date) {
    return null;
  }
  return moment(date).format('YYYY.MM.DD HH:mm');
}

export function createValidDateTimeDots(date: string | Date) {
  if (!date) {
    return null;
  }
  return moment(date).format('DD.MM.YYYY HH:mm');
}

export function createValidDateTime(date: string | Date | Moment.Moment, withSeconds = false) {
  if (!date) {
    return null;
  }
  const newData = !withSeconds ? moment(date).seconds(0) : moment(date);
  return newData.format('YYYY-MM-DDTHH:mm:ss');
}

export function formatDate(date: string | Date, format: string) {
  if (!date) {
    return null;
  }

  return moment(date).format(format);
}

export function getFormattedDateTime(date: string | number | Date) {
  if (!date) {
    return '';
  }
  return moment(date).format(
    `${global.APP_DATE_FORMAT} ${global.APP_TIME_FORMAT}`,
  );
}

export function getFormattedDateTimeWithSecond(date: string | Date) {
  if (!date) {
    return '';
  }
  return moment(date).format(
    `${global.APP_DATE_FORMAT} ${global.APP_TIME_WITH_SECOND_FORMAT}`,
  );
}

export function getFormattedTimeWithSecond(date: string | Date) {
  if (!date) {
    return '';
  }
  return moment(date).format(`${global.APP_TIME_WITH_SECOND_FORMAT}`);
}

export function getFormattedDateTimeSeconds(date: string | Date | Moment.Moment) {
  if (!date) {
    return '';
  }
  return moment(date).format(`${global.APP_DATE_FORMAT} HH:mm:ss`);
}

export function makeDateFromUnix(date: number) {
  if (!date) {
    return '-';
  }
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

export function getYesterdayYesterday0am() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 0, 0);
}

export function getYesterdayYesterday2359() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 23, 59);
}

export function getDate9am(date: string | Date) {
  const now = new Date(date);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0);
}

export function getNextDay859am(date: string | Date) {
  const now = new Date(date);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 59);
}

export function getToday9am(seconds?: number) {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    0,
    seconds || 0,
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

export function setDateTime2359(dateOwn) {
  const date = moment(dateOwn);
  date.hours(23);
  date.minutes(59);

  return date.toDate();
}

export function getToday2359() {
  return setDateTime2359(new Date());
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

export function isValidDate(date: string | Date) {
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

function pad(num: string | number) {
  return `0${num}`.slice(-2);
}
export function secondsToTime(secs: number) {
  let mMinutes = Math.floor(secs / 60);
  const mSecs = secs % 60;
  const mHours = Math.floor(mMinutes / 60);
  mMinutes %= 60;
  return `${pad(mHours)}:${pad(mMinutes)}:${pad(mSecs)}`;
}

export const getCurrentSeason = (summer_start_date: string = null, summer_end_date: string = null, input_date = null) => {
  const date = input_date || new Date();

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
export const addTime = (date: string | Date, count: number, typeAdd: Moment.unitOfTime.DurationConstructor) =>
  moment(date)
    .add(count, typeAdd)
    .format();

export const diffDatesByDays = (dateA: string | Date, dateB: string | Date) =>
  diffDates(createValidDate(dateA), createValidDate(dateB), 'days');

export const monthOptions = Array(12).fill(0).map(
  (_, index) => {
    const monthName = moment().month(index).format('MMMM');

    return ({
      value: index + 1,
      label: monthName.charAt(0).toUpperCase() + monthName.substr(1),
    });
  },
);

export const makeDateFormated = (date: string | Date, time?: boolean, empty?: string) => {
  if (!date) {
    return empty || '';
  }
  if (time) {
    return getFormattedDateTime(date);
  }
  return makeDate(date);
};

export const minusTime = (date, count, typeAdd) =>
  moment(date)
    .subtract(count, typeAdd)
    .format();
