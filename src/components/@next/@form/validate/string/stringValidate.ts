import { isString, isNullOrUndefined } from 'util';
import { StringField } from 'components/@next/@form/@types';
import {
  getRequiredFieldNoTrim,
  getMinLengthError,
  getMaxLengthError,
  getRequiredFieldMessage,
  getRequiredFieldStringMessage,
  getFixedLengthCollectionError,
} from 'components/@next/@utils/getErrorString/getErrorString';

export const validateString = <F extends Record<string, any>>(key: keyof F, fieldData: StringField<F>, formState: F) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
    fixedLengthCollection,
  } = fieldData;

  if (fieldData.required && !value) {
    return getRequiredFieldMessage(title);
  }

  if (fieldData.minLength && value && isString(value) && value.length < fieldData.minLength) {
    return getMinLengthError(fieldData.minLength);
  }

  if (fieldData.maxLength && value && isString(value) && value.length > fieldData.maxLength) {
    return getMaxLengthError(fieldData.maxLength);
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
    return getFixedLengthCollectionError(fixedLengthCollection);
  }

  if (!(isString(value) || isNullOrUndefined(value))) {
    return getRequiredFieldStringMessage(title);
  }
  return '';
};
