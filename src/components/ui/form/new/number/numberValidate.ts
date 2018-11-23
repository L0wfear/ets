import { PropertieType } from 'components/ui/form/new/@types/validate.h';
import { isNumber } from 'util';

export const validateNumber = <F, P>(fieldData: PropertieType, formState: F, props: P) => {
  const {
    [fieldData.key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && (!value && value !== 0)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  if (isNumber(value)) {
    return '';
  }

  return `Поле "${title}" должно быть числом`;
};
