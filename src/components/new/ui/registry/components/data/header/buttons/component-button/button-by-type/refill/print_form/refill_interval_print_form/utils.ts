import { isObject, isNullOrUndefined } from 'util';
import { RefillReportForm } from './@types';

export const defaultRefillReportFormFunc = (): RefillReportForm => ({
  date_from: '',
  date_to: '',
  registryKey: '',
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
