import { isString, isNullOrUndefined } from 'util';
import { StringField } from 'components/@next/@form/@types';
import { getRequiredFieldNoTrim } from 'components/@next/@utils/getErrorString/getErrorString';

export const validateString = <F extends Record<string, any>>(key: keyof F, fieldData: StringField<F>, formState: F) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
    fixedLengthCollection,
  } = fieldData;

  if (fieldData.required && !value) {
    return `Поле "${title}" должно быть заполнено`;
  }

  if (fieldData.minLength && value && isString(value) && value.length < fieldData.minLength) {
    return `Длина поля должна быть больше минимального количества символов (${fieldData.minLength})`;
  }

  if (fieldData.maxLength && value && isString(value) && value.length > fieldData.maxLength) {
    return `Длина поля не должна превышать максимальное количество символов (${fieldData.maxLength})`;
  }

  if (value && isString(value) && value.length !== value.trim().length) {
    return getRequiredFieldNoTrim(title);
  }

  if (
    value
    && isString(value)
    && Array.isArray(fixedLengthCollection)
    && !fixedLengthCollection.includes(value.length)
  ) {
    return `Длина поля должна быть равной одному из значений (${fixedLengthCollection.join(', ')})`;
  }

  if (isString(value) || isNullOrUndefined(value) ) {
    return '';
  }
  return `Поле "${title}" должно быть строкой`;
};
