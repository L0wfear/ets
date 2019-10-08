import { NumberField } from 'components/@next/@form/@types';
import { isNumber, isNullOrUndefined } from 'util';
import { getRequiredFieldMessage, getRequiredFieldNumberMessage, getRequiredFieldNumberMoreThen, getRequiredFieldNumberMoreThenZero } from 'components/@next/@utils/getErrorString/getErrorString';
import { get } from 'lodash';

export const floatValidate = (value: number, float: number, title: string) => {
  const regexp = new RegExp(`^[+]?[0-9]*[\.|,][0-9]{${float + 1},}$`);
  if (value.toString().match(regexp)) {
    return `Поле "${title}" должно быть неотрицательным числом с ${float} знаками после запятой`;
  }
};
export const validateNumber = <F extends Record<string, any>>(key: keyof F, fieldData: NumberField<F>, formState: F) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if ( fieldData.required && (value === "" || isNullOrUndefined(value)) ) {
    return getRequiredFieldMessage(title);
  }

  if (!isNullOrUndefined(value)) {
    if (isNaN(Number(value.toString().replace(/,/g, '.')))) {
      return getRequiredFieldNumberMessage(title);
    }

    const numberValue = Number(value);
    const regExpVal = fieldData.regexp
      ? new RegExp(fieldData.regexp)
      : null;
    const regexpErrorText = get(fieldData, 'regexpErrorText', 'Определи regexpErrorText в схеме');

    if (fieldData.minLength && Number.parseInt(numberValue.toString(), 0).toString().length < fieldData.minLength) {
      return `Длина поля должна быть больше минимального количества символов (${fieldData.minLength})`;
    }

    if (fieldData.maxLength && Number.parseInt(numberValue.toString(), 0).toString().length > fieldData.maxLength) {
      return `Длина поля не должна превышать максимальное количество символов (${fieldData.maxLength})`;
    }

    if (isNumber(fieldData.min) && numberValue < fieldData.min) {
      return `Поле "${title}" должно быть больше либо равно ${fieldData.min}`;
    }

    if (isNumber(fieldData.minNotEqual) && numberValue <= fieldData.minNotEqual && fieldData.minNotEqual === -1) {
      return getRequiredFieldNumberMoreThenZero(fieldData.title);
    }
    if (isNumber(fieldData.minNotEqual) && numberValue <= fieldData.minNotEqual) {
      return getRequiredFieldNumberMoreThen(title, fieldData.minNotEqual);
    }

    if (isNumber(fieldData.max) && numberValue > fieldData.max) {
      return `Поле "${title}" должно быть не больше ${fieldData.max}`;
    }

    if (fieldData.integer && Math.ceil(numberValue) !== numberValue) {
      return `Поле "${title}" целым должно быть числом`;
    }

    if (regExpVal && !regExpVal.test(value)) {
      return `${regexpErrorText}`;
    }

    if (!fieldData.integer && fieldData.float) {
      const error = floatValidate(numberValue, fieldData.float, title);
      if (error) {
        return error;
      }
    }

    if (isNumber(Number(value))) {
      return '';
    }

    return getRequiredFieldNumberMessage(title);
  }

  return '';
};
