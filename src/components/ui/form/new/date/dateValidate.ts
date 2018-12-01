import { DatePropertie } from 'components/ui/form/new/@types/validate.h';

export const validateDate = <F, P>(fieldData: DatePropertie<F>, formState: F, props: P) => {
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
