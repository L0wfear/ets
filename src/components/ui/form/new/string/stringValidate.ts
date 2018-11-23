import { PropertieType } from 'components/ui/form/new/@types/validate.h';
import { isString } from 'util';

export const validateString = <F, P>(fieldData: PropertieType, formState: F, props: P) => {
  const {
    [fieldData.key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !value) {
    return `Поле "${title}" должно быть заполнено`;
  }

  if (isString(value) || value === null) {
    return '';
  }

  return `Поле "${title}" должно быть строкой`;
};
