import { NumberPropertie } from 'components/ui/form/new/@types/validate.h';
import { isNumber, isNullOrUndefined } from 'util';

export const validateNumber = <K, F, P, RootFormState>(key: keyof F, fieldData: NumberPropertie<K, F, P>, formState: F, props: P, rootFormState: RootFormState) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && isNullOrUndefined(value)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  if (!isNullOrUndefined(value)) {
    if (isNaN(Number(value.toString().replace(/,/g, '.')))) {
      return `Поле "${title}" должно быть числом`;
    }

    const numberValue = Number(value);

    if (fieldData.minLength && Number.parseInt(numberValue.toString(), 0).toString().length < fieldData.minLength) {
      return `Длина поля должна быть больше минимального количества символов (${fieldData.minLength})`;
    }

    if (fieldData.maxLength && Number.parseInt(numberValue.toString(), 0).toString().length > fieldData.maxLength) {
      return `Длина поля не должна превышать максимальное количество символов (${fieldData.maxLength})`;
    }

    if (isNumber(fieldData.min) && numberValue < fieldData.min) {
      return `Поле "${fieldData.title}" должно быть больше ${fieldData.min}`;
    }

    if (isNumber(fieldData.minNotEqual) && numberValue <= fieldData.minNotEqual) {
      return `Поле "${fieldData.title}" должно быть больше ${fieldData.minNotEqual}`;
    }

    if (isNumber(fieldData.max) && numberValue > fieldData.max) {
      return `Поле "${fieldData.title}" должно быть не больше ${fieldData.max}`;
    }

    if (fieldData.integer && Math.ceil(numberValue) !== numberValue) {
      return `Поле "${fieldData.title}" целым должно быть числом`;
    }

    if (!fieldData.integer && fieldData.float) {
      const regexp = new RegExp(`^[+]?[0-9]*[\.|,][0-9]{${fieldData.float + 1},}$`);
      if (numberValue.toString().match(regexp)) {
        return `Поле ${fieldData.title} должно быть неотрицательным числом с ${fieldData.float} знаками после запятой`;
      }
    }

    if (isNumber(Number(value))) {
      return '';
    }

    return `Поле "${title}" должно быть числом`;
  }

  return '';
};
