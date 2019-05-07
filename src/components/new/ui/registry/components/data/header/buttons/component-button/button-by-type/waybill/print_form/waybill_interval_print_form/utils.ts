import { isObject, isNullOrUndefined } from 'util';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import { WaybillsReportForm } from './@types';

export const defaultWaybillsReportFormFunc = (): WaybillsReportForm => ({
  date_start: createValidDateTime(getToday9am()),
  date_end: createValidDateTime(getTomorrow9am()),
  withFilter: false,
});

export const getDefaultWaybillsReportFormElement = (element: Partial<WaybillsReportForm>): WaybillsReportForm => {
  const defaultWaybillsReportForm = defaultWaybillsReportFormFunc();
  const newElement = { ...defaultWaybillsReportForm };
  if (isObject(element)) {
    Object.keys(defaultWaybillsReportForm).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultWaybillsReportForm[key];
    });
  }

  return newElement;
};
