import { StringPropertie } from 'components/ui/form/new/@types/validate.h';
import { isString } from 'util';

export const validateString = <K, F, P, RootFormState>(key: keyof F, fieldData: StringPropertie<K, F, P>, formState: F, props: P, rootFormState: RootFormState) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !value) {
    return `Поле "${title}" должно быть заполнено`;
  }

  if (fieldData.minLength && value && isString(value) && value.length < fieldData.minLength) {
    return `Длина поля должна быть больше минимального количества символов (${fieldData.minLength})`;
  }

  if (fieldData.trimSpace && value && isString(value) && value.trim() !== value) {
    return `Поле "${title}" не должно начинаться и закачиваться пробелом`;
  }

  if (fieldData.maxLength && value && isString(value) && value.length > fieldData.maxLength) {
    return `Длина поля не должна превышать максимальное количество символов (${fieldData.maxLength})`;
  }

  if (value && isString(value) && value.length !== value.trim().length) {
    return `Поле ${fieldData.title} не должно начинаться и заканчиваться пробелом`;
  }

  if (isString(value) || value === null) {
    return '';
  }
  return `Поле "${title}" должно быть строкой`;
};
