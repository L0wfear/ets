import {
  diffDates,
} from 'components/@next/@utils/dates/dates';

test.only('Проверка diffDates', () => {
  const newDate = new Date();
  const addSecondDate = new Date(newDate);
  const addMinuteDate = new Date(newDate);
  const addHourDate = new Date(newDate);
  const addDayDate = new Date(newDate);
  const addMounthDate = new Date(newDate);
  addSecondDate.setSeconds(addSecondDate.getSeconds() + 30);
  addMinuteDate.setMinutes(addMinuteDate.getMinutes() + 30);
  addHourDate.setHours(addHourDate.getHours() + 12);
  addDayDate.setDate(addDayDate.getDay() + 15);
  addMounthDate.setMonth(addMounthDate.getMonth() + 6);

  expect(diffDates() === 0).toBeTruthy();
  expect(diffDates(newDate) <= 0).toBeTruthy();
  expect(diffDates(addSecondDate) >= 0).toBeTruthy();

  expect(diffDates(newDate, newDate)).toBe(0);

  // seconds
  expect(diffDates(newDate, addSecondDate)).toBe(-30);
  expect(diffDates(newDate, addSecondDate, 'seconds')).toBe(-30);
  expect(diffDates(addSecondDate, newDate)).toBe(30);
  expect(diffDates(addSecondDate, newDate, 'seconds')).toBe(30);

  // minutes
  expect(diffDates(newDate, addMinuteDate, 'minutes')).toBe(-30);
  expect(diffDates(addMinuteDate, newDate, 'minutes')).toBe(30);
  expect(diffDates(newDate, addSecondDate, 'minutes')).toBe(-0.5);
  expect(diffDates(newDate, addSecondDate, 'minutes', false)).toBe(0);

  // minutes
  expect(diffDates(newDate, addMinuteDate, 'minutes')).toBe(-30);
  expect(diffDates(addMinuteDate, newDate, 'minutes')).toBe(30);
  expect(diffDates(newDate, addSecondDate, 'minutes')).toBe(-0.5);
  expect(diffDates(newDate, addSecondDate, 'minutes', false)).toBe(0);

});
