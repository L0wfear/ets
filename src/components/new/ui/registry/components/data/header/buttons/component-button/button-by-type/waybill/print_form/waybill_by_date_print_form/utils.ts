import { isObject, isNullOrUndefined } from 'util';
import { createValidDate } from 'components/@next/@utils/dates/dates';
import { WaybillPrintJournalForm } from './@types';

export const defaultWaybillPrintJournalFormFunc = (): WaybillPrintJournalForm => ({
  month: (new Date()).getMonth() + 1,
  year: (new Date()).getFullYear(),
  formationPeriod: 'month',
  date: createValidDate(new Date()),
});

export const getDefaultWaybillPrintJournalFormElement = (element: Partial<WaybillPrintJournalForm>): WaybillPrintJournalForm => {
  const defaultWaybillPrintJournalForm = defaultWaybillPrintJournalFormFunc();
  const newElement = { ...defaultWaybillPrintJournalForm };
  if (isObject(element)) {
    Object.keys(defaultWaybillPrintJournalForm).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultWaybillPrintJournalForm[key];
    });
  }

  newElement.date = null;

  return newElement;
};

export const FORMATION_PERIOD_OPTIONS = [
  { value: 'day', label: 'Дневной' },
  { value: 'month', label: 'Месячный' },
];
export const sortingMonthFunction = (a, b) => a.value - b.value;

export const YEARS_FORM_2016 = Array.from(
  { length: 11 },
  (y, i) => ({
    label: `${i + 2016}`,
    value: i + 2016,
  }),
);
