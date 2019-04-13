import { DatePropertie } from 'components/ui/form/new/@types/validate.h';

export const validateDate = <F, P>(key: keyof F, fieldData: DatePropertie, formState: F, props: P) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !value) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
