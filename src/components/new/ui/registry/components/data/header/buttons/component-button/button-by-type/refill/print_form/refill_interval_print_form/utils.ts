import { isObject, isNullOrUndefined } from 'util';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { RefillReportForm } from './@types';

export const defaultRefillReportFormFunc = (): RefillReportForm => ({
  date_start: createValidDateTime(getToday9am()),
  date_end: createValidDateTime(getTomorrow9am()),
});

export const getDefaultRefillReportFormElement = (element: Partial<RefillReportForm>): RefillReportForm => {
  const defaultRefillReportForm = defaultRefillReportFormFunc();
  const newElement = { ...defaultRefillReportForm };
  if (isObject(element)) {
    Object.keys(defaultRefillReportForm).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultRefillReportForm[key];
    });
  }

  return newElement;
};
