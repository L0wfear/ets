import { DateTimePropertie } from 'components/old/ui/form/new/@types/validate.h';
import { diffDates } from 'utils/dates';

export const validateDatetime = <K, F, P, RootFormState>(key: keyof F, fieldData: DateTimePropertie<K, F, P>, formState: F, props: P, rootFormState: RootFormState) => {
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
