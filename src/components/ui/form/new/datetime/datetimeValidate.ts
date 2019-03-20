import { DateTimePropertie } from 'components/ui/form/new/@types/validate.h';

export const validateDatetime = <F, P>(fieldData: DateTimePropertie<F>, formState: F, props: P) => {
  const {
    [fieldData.key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !value) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
