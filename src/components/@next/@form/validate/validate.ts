import { isObject, isArray } from 'util';

import { SchemaFormContext, FormErrorBySchema } from 'components/@next/@form/@types';

import { validateString } from 'components/@next/@form/validate/string/stringValidate';
import { validateValueOfArray } from 'components/@next/@form/validate/valueOfArray/valueOfArrayValidate';
import { validateNumber } from 'components/@next/@form/validate/number/numberValidate';
import { validateBoolean } from 'components/@next/@form/validate/boolean/booleanValidate';
import { validateDate } from 'components/@next/@form/validate/date/dateValidate';
import { validateDatetime } from 'components/@next/@form/validate/datetime/datetimeValidate';
import { validateMultiValueOfArray } from 'components/@next/@form/validate/multiValueOfArray/multiValueOfArrayValidate';

export const validate = <F extends Record<string, any>>(shemaBody: SchemaFormContext<F>['body'], formState: F): FormErrorBySchema<F> => {
  const formError = Object.fromEntries(
    Object.keys(shemaBody.validate_fields).map((key) => [key, '']),
  );

  Object.entries(shemaBody.validate_fields).forEach(
    (fieldSchemaEntries) => {
      const key = fieldSchemaEntries[0] as keyof F;
      const fieldData = fieldSchemaEntries[1];

      if (fieldData.type === 'boolean') {
        formError[key] = validateBoolean<F>(key, fieldData, formState);
      }
      if (fieldData.type === 'number') {
        formError[key] = validateNumber<F>(key, fieldData, formState);
      }
      if (fieldData.type === 'string') {
        formError[key] = validateString<F>(key, fieldData, formState);
      }
      if (fieldData.type === 'valueOfArray') {
        formError[key] = validateValueOfArray<F>(key, fieldData, formState);
      }
      if (fieldData.type === 'date') {
        formError[key] = validateDate<F>(key, fieldData, formState);
      }
      if (fieldData.type === 'datetime') {
        formError[key] = validateDatetime<F>(key, fieldData, formState);
      }
      if (fieldData.type === 'multiValueOfArray') {
        formError[key] = validateMultiValueOfArray<F>(key, fieldData, formState);
      }
    },
  );

  return formError;
};

// проверка formErrors на ошибки
export const canSaveTest = (errors: object | string | string[]) => {
  if (isObject(errors)) {
    return Object.values(errors).every((error) => canSaveTest(error));
  }
  if (isArray(errors)) {
    return errors.every((error) => canSaveTest(error));
  }

  return !errors;
};
