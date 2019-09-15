import { BooleanField } from 'components/@next/@form/@types';
import { isBoolean } from 'util';

export const validateBoolean = <F extends Record<string, any>>(key: keyof F, fieldData: BooleanField, formState: F) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !isBoolean(value)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
