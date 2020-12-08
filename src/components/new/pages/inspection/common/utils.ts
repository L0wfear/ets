import { createValidDate, diffDates } from 'components/@next/@utils/dates/dates';

export const validateResolveToField = (value, dataForValidation, status) => {
  const date = createValidDate(value);
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
