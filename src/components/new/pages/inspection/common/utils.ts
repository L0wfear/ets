import { createValidDate, diffDates } from 'components/@next/@utils/dates/dates';

export const validateResolveToField = (value, dataForValidation, status, date_start) => {
  const date = createValidDate(value);
  const dateStart = createValidDate(date_start);
  if (
    value
    && diffDates(date, dateStart) < 0
  ) {
    return 'Дата предоставления отчета не может быть меньше даты открытия проверки';
  }
  if (
    status === 'completed'
      && dataForValidation?.props_resolve_to
      && !value
  ) {
    return 'Поле должно быть заполнено, так как ранее был указан срок, до которого необходимо предоставить отчет об устранении недостатков';
  }
  if (
    status === 'conducting'
      && dataForValidation?.current_date
      && diffDates(date, dataForValidation?.current_date) < 0
  ) {
    return 'Дата предоставления отчета не может быть меньше текущей';
  }
  if (
      dataForValidation?.props_resolve_to
      && status === 'completed'
      && diffDates(date, dataForValidation?.props_resolve_to) < 0
  ) {
    return 'Дата предоставления отчета не может быть изменена на более раннюю';
  }
  return '';
};
