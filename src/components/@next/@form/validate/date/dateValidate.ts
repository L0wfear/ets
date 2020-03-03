import { diffDates } from 'components/@next/@utils/dates/dates';
import { DateField } from 'components/@next/@form/@types';

export const validateDate = <F extends Record<string, any>>(key: keyof F, fieldData: DateField<F>, formState: F) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (value && diffDates(new Date('1900-01-01T00:00:00'), value) > 0 ) {
    return `Дата в поле "${title}" должна быть позже 1900 года`;
  }

  if (fieldData.required && !value) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
