import { get } from 'lodash';
import { isObject, isArray } from 'util';

import { FormErrorBySchema, SchemaFormContextBody } from 'components/@next/@form/@types';
import { ReduxState } from 'redux-main/@types/state';

import { validateDate } from 'components/@next/@form/validate/date/dateValidate';
import { validateNumber } from 'components/@next/@form/validate/number/numberValidate';
import { validateString } from 'components/@next/@form/validate/string/stringValidate';
import { validateBoolean } from 'components/@next/@form/validate/boolean/booleanValidate';
import { validateDatetime } from 'components/@next/@form/validate/datetime/datetimeValidate';
import { validateValueOfArray } from 'components/@next/@form/validate/valueOfArray/valueOfArrayValidate';
import { validateMultiValueOfArray } from 'components/@next/@form/validate/multiValueOfArray/multiValueOfArrayValidate';

// проверка formErrors на ошибки
export const canSaveTest = <F extends Record<string, any>>(formError: FormErrorBySchema<F> | FormErrorBySchema<F>[any]): boolean => {
  if (isObject(formError)) {
    return Object.values(formError).every((error) => canSaveTest(error));
  }
  if (isArray(formError)) {
    return formError.every((error) => canSaveTest(error));
  }

  return !formError;
};

export const canSaveIgnoreRequiredTest = <F extends Record<string, any>>(formError: FormErrorBySchema<F> | FormErrorBySchema<F>[any], formState: F | F[any]): boolean => { 
  return Object.keys(formError)
    .filter((key) => formError[key])
    .every((key) => {
      if (isObject(formError[key])) {
        return canSaveIgnoreRequiredTest(formError[key], formState[key]);
      }
      return isArray(formState[key]) ? formState[key].length === 0 : !formState[key];
    });
};

export const validate = <F extends Record<string, any>>(validate_fields: SchemaFormContextBody<F>['validate_fields'], formState: F, reduxState: ReduxState) => {
  return Object.entries(validate_fields).reduce(
    (formError: FormErrorBySchema<F>, fieldSchemaEntries) => {
      const key = fieldSchemaEntries[0] as keyof FormErrorBySchema<F>;
      const fieldData = fieldSchemaEntries[1];

      const {
        validateIf: validateIfRaw,
      } = fieldData;
      let skipValidate = false;

      if (validateIfRaw) {
        const validateIfArray = isArray(validateIfRaw) ? validateIfRaw : [validateIfRaw];

        for (let i = 0, length = validateIfArray.length; i < length; i++) {
          const validateIf = validateIfArray[i];

          if (validateIf.type === 'has_data') {
            const {
              reverse = false,
            } = validateIf;
            const valueByPath = get(formState, validateIf.path, false);

            if (!reverse ? !valueByPath : valueByPath) {
              skipValidate = true;
            }
          }
          if (validateIf.type === 'equal_to_value') {
            const {
              value,
              reverse = false,
            } = validateIf;
            const valueByPath = get(formState, validateIf.path, false);

            if (reverse ? valueByPath === value : valueByPath !== value) {
              skipValidate = true;
            }
          }

          if (validateIf.type === 'fixed_length') {
            const {
              value,
              reverse = false,
            } = validateIf;
            const valueByPath = get(formState, validateIf.path, false);

            if (reverse ? valueByPath === value : valueByPath !== value) {
              skipValidate = true;
            }
          }
        }
      }

      if (!skipValidate) {
        if (fieldData.type === 'date') {
          formError[key] = validateDate<F>(key, fieldData, formState);
        }
        if (fieldData.type === 'number') {
          formError[key] = validateNumber<F>(key, fieldData, formState);
        }
        if (fieldData.type === 'string') {
          formError[key] = validateString<F>(key, fieldData, formState);
        }
        if (fieldData.type === 'boolean') {
          formError[key] = validateBoolean<F>(key, fieldData, formState);
        }
        if (fieldData.type === 'datetime') {
          formError[key] = validateDatetime<F>(key, fieldData, formState);
        }
        if (fieldData.type === 'valueOfArray') {
          formError[key] = validateValueOfArray<F>(key, fieldData, formState);
        }
        if (fieldData.type === 'multiValueOfArray') {
          formError[key] = validateMultiValueOfArray<F>(key, fieldData, formState);
        }
        if (fieldData.type === 'schema') {
          formError[key] = validate<F>(fieldData.validate_fields, formState, reduxState);
        }

        if (canSaveTest(formError[key]) && isArray(fieldData.dependencies)) {
          fieldData.dependencies.some(
            (func) => formError[key] = func(formState[key as string], formState, reduxState),
          );
        }
      }

      return formError;
    },
    {},
  );
};
