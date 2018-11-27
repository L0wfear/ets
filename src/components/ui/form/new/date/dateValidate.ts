import { PropertieType } from 'components/ui/form/new/@types/validate.h';

export const validateDate = <F, P>(fieldData: PropertieType, formState: F, props: P) => {
  const {
    [fieldData.key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && (!value && value !== 0)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
