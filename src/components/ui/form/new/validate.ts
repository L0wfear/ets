import {
  SchemaType,
} from 'components/ui/form/new/@types/validate.h';
import { get } from 'lodash';

import { validateString } from 'components/ui/form/new/string/stringValidate';
import { validateNumber } from 'components/ui/form/new/number/numberValidate';
import { validateValueOfArray } from 'components/ui/form/new/valueOfArray/valueOfArrayValidate';
import { validateMultiValueOfArray } from 'components/ui/form/new/multiValueOfArray/multiValueOfArrayValidate';
import { validateDate } from 'components/ui/form/new/date/dateValidate';
import { validateDatetime } from 'components/ui/form/new/datetime/datetimeValidate';
import { validateBoolean } from 'components/ui/form/new/boolean/booleanValidate';

import { isObject } from 'util';
import { isArray } from 'highcharts';

const hasError = (errorsData: any) => {
  if (isObject(errorsData)) {
    return Object.values(errorsData).every((error) => hasError(error));
  }
  if (isArray(errorsData)) {
    return errorsData.every((error) => hasError(error));
  }

  return Boolean(errorsData);
};

const mergeErrors = (errorOld: any, error: any) => {
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
        validateIf,
      } = fieldData;
      let skipValidate = false;

      if (validateIf) {
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
      }

      if (!skipValidate) {
        switch (fieldData.type) {
          case 'string': {
            formError[key] = validateString<any, F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
            break;
          }
          case 'number': {
            formError[key] = validateNumber<any, F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
            break;
          }
          case 'valueOfArray': {
            formError[key] = validateValueOfArray<any, F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
            break;
          }
          case 'multiValueOfArray': {
            formError[key] = validateMultiValueOfArray<any, F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
            break;
          }
          case 'date': {
            formError[key] = validateDate<any, F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
            break;
          }
          case 'datetime': {
            formError[key] = validateDatetime<any, F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
            break;
          }
          case 'boolean': {
            formError[key] = validateBoolean<any, F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
            break;
          }
          case 'schema': {
            formError[key] = validate<F[keyof F], P, RootFormState>((fieldData as any).schema, formState[key], props, rootFormState);
            break;
          }
          default:
            throw new Error('Нужно определить функцию для валидации');
        }

        if (fieldData.dependencies && !hasError(formError[key])) {
          fieldData.dependencies.some((dependencieValidator) => {
            const error = dependencieValidator(formState[key], formState, props, rootFormState);
            if (hasError(error)) {
              formError[key] = mergeErrors(formError[key], error);
              return true;
            }
          });
        }
      }
    }
  }

  return formError;
};
