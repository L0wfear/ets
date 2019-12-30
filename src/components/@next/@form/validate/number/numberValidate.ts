import { isNumber, isNullOrUndefined } from 'util';
import { NumberField } from 'components/@next/@form/@types';
import {
  getRequiredFieldMessage,
  getRequiredFieldNumberMessage,
  getRequiredFieldNumberMoreThen,
  getRequiredFieldNumberMoreThenZero,
  getAltMinError,
  getMoreOrEqualError,
  getMinLengthError,
  getMaxLengthError,
} from 'components/@next/@utils/getErrorString/getErrorString';

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

  if ( fieldData.required && (value === '' || isNullOrUndefined(value)) ) {
    return getRequiredFieldMessage(title);
  }

  if (!isNullOrUndefined(value)) {
    if (isNaN(Number(value.toString().replace(/,/g, '.')))) {
      return getRequiredFieldNumberMessage(title);
    }

    const numberValue = Number(value);

    if (fieldData.minLength && Number.parseInt(numberValue.toString(), 0).toString().length < fieldData.minLength) {
      return getMinLengthError(fieldData.minLength);
    }

    if (fieldData.maxLength && Number.parseInt(numberValue.toString(), 0).toString().length > fieldData.maxLength) {
      return getMaxLengthError(fieldData.maxLength);
    }

    if (isNumber(fieldData.min) && numberValue < fieldData.min) {
      if (isNumber(fieldData.max) && fieldData.alt_min) {
        return getAltMinError(title, fieldData.max);
      }
      return getMoreOrEqualError(title, fieldData.min);
    }

    if (isNumber(fieldData.minNotEqual) && numberValue <= fieldData.minNotEqual) {
      if (fieldData.minNotEqual === -1) {
        return getRequiredFieldNumberMoreThenZero(fieldData.title);
      }
      return getRequiredFieldNumberMoreThen(title, fieldData.minNotEqual);
    }

    if (isNumber(fieldData.max) && numberValue > fieldData.max) {
      return `Поле "${title}" должно быть не больше ${fieldData.max}`;
    }

    if (fieldData.integer && Math.ceil(numberValue) !== numberValue) {
      return `Поле "${title}" должно быть целым числом`;
    }

    if (fieldData.regexp) {
      const regExpVal = new RegExp(fieldData.regexp);

      if (regExpVal && !regExpVal.test(value)) {
        return `${fieldData.regexpErrorText}`;
      }
    }

    if (fieldData.float) {
      const error = floatValidate(numberValue, fieldData.float, title);
      if (error) {
        return error;
      }
    }
  }

  return '';
};
