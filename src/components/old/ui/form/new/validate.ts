import { get } from 'lodash';
import { isObject, isArray } from 'util';

import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

import { validateDate } from 'components/@next/@form/validate/date/dateValidate';
import { validateString } from 'components/@next/@form/validate/string/stringValidate';
import { validateNumber } from 'components/@next/@form/validate/number/numberValidate';
import { validateBoolean } from 'components/@next/@form/validate/boolean/booleanValidate';
import { validateDatetime } from 'components/@next/@form/validate/datetime/datetimeValidate';
import { validateValueOfArray } from 'components/@next/@form/validate/valueOfArray/valueOfArrayValidate';
import { validateMultiValueOfArray } from 'components/@next/@form/validate/multiValueOfArray/multiValueOfArrayValidate';

const mergeErrors = (errorOld: any, error: any) => {
  if (!errorOld) {
    return error;
  }

  if (isObject(errorOld)) {
    return Object.entries(errorOld).reduce(
      (errorNew, [key, value]) => {
        errorNew[key] = mergeErrors(value, get(error, key, {}));
        return errorNew;
      },
      {},
    );
  }
  if (isArray(errorOld)) {
    return errorOld.reduce(
      (errorNew, value, key) => {
        errorNew[key] = mergeErrors(value, get(error, key, {}));
        return errorNew;
      },
      {},
    );
  }

  return errorOld || error;
};

export const validate = <F, P, RootFormState>(shema: SchemaType<F, P>, formState: F, props: P, rootFormState: RootFormState): any => {
  const {
    properties,
  } = shema;

  const formError: any = {};

  for (const key in properties) {
    if (key in properties) {

      const fieldData: any = properties[key];

      const {
        validateIf: validateIfRaw,
      } = fieldData;
      let skipValidate = false;

      if (validateIfRaw) {
        const validateIfArray = isArray(validateIfRaw) ? validateIfRaw : [validateIfRaw];

        for (let i = 0, length = validateIfArray.length; i < length; i++) {
          const validateIf = validateIfArray[i];

          const {
            type,
          } = validateIf;

          if (type === 'has_data') {
            const {
              reverse = false,
            } = validateIf;
            const valueByPath = get(rootFormState, validateIf.path, false);

            if (!reverse ? !valueByPath : valueByPath) {
              skipValidate = true;
            }
          }
          if (type === 'equal_to_value') {
            const {
              value,
              reverse = false,
            } = validateIf;
            const valueByPath = get(rootFormState, validateIf.path, false);

            if (reverse ? valueByPath === value : valueByPath !== value) {
              skipValidate = true;
            }
          }

          if (type === 'fixed_length') {
            const {
              value,
              reverse = false,
            } = validateIf;
            const valueByPath = get(rootFormState, validateIf.path, false);

            if (reverse ? valueByPath === value : valueByPath !== value) {
              skipValidate = true;
            }
          }
        }
      }

      if (!skipValidate) {
        switch (fieldData.type) {
          case 'string': {
            formError[key] = validateString<F>(key, fieldData, formState);
            break;
          }
          case 'number': {
            formError[key] = validateNumber<F>(key, fieldData, formState);
            break;
          }
          case 'valueOfArray': {
            formError[key] = validateValueOfArray<F>(key, fieldData, formState);
            break;
          }
          case 'multiValueOfArray': {
            formError[key] = validateMultiValueOfArray<F>(key, fieldData, formState);
            break;
          }
          case 'date': {
            formError[key] = validateDate<F>(key, fieldData, formState);
            break;
          }
          case 'datetime': {
            formError[key] = validateDatetime<F>(key, fieldData, formState);
            break;
          }
          case 'boolean': {
            formError[key] = validateBoolean<F>(key, fieldData, formState);
            break;
          }
          case 'schema': {
            formError[key] = validate<F[keyof F], P, RootFormState>((fieldData as any).schema, formState[key], props, rootFormState);
            break;
          }
          case 'any': {
            formError[key] = '';
            break;
          }
          default:
            throw new Error('Нужно определить функцию для валидации');
        }

        if (fieldData.dependencies) {
          fieldData.dependencies.some((dependencieValidator) => {
            const error = dependencieValidator(formState[key], formState, props, rootFormState);

            formError[key] = mergeErrors(formError[key], error);
            return true;
          });
        }
      }
    }
  }

  return formError;
};

export const validateDisable = <F, P, RootFormState>(shema: SchemaType<F, P>, formState: F, props: P, rootFormState: RootFormState): any => {
  const {
    properties,
  } = shema;

  const formDisable: any = {};

  for (const key in properties) {
    if (key in properties) {
      const fieldData: any = properties[key];
      if (fieldData.dependenciesDisable) {
        fieldData.dependenciesDisable.some((dependencieValidator) => {
          const isDisable = dependencieValidator(formState[key], formState, props, rootFormState);

          formDisable[key] = mergeErrors(formDisable[key], isDisable);
          return true;
        });
      }
    }
  }

  return formDisable;
};
