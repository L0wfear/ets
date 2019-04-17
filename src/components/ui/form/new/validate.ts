import {
  SchemaType,
  DependencieFieldValidatorArrType,
  PropertieFieldValidatorArrType,
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

const emptyObj = {};

export const validate = <F, P, RootFormState>(shema: SchemaType<F, P>, formState: F, props: P, rootFormState: RootFormState): any => {
  const {
    properties,
    dependencies,
  } = shema;

  const formError = Object.entries<PropertieFieldValidatorArrType<F, P>>(properties).reduce((newObj: any, entriesData) => {
    const key: keyof F = entriesData[0] as keyof F;
    const fieldData: any = entriesData[1];

    const {
      validateIf,
    } = fieldData;

    if (validateIf) {
      const {
        reverse = false,
      } = validateIf;

      const valueByPath = get(rootFormState, validateIf.path, false);

      if (!reverse ? !valueByPath : valueByPath) {
        return newObj;
      }
    }

    switch (fieldData.type) {
      case 'string':
        newObj[key] = validateString<F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
        break;
      case 'number':
        newObj[key] = validateNumber<F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
        break;
      case 'valueOfArray':
        newObj[key] = validateValueOfArray<F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
        break;
      case 'multiValueOfArray':
        newObj[key] = validateMultiValueOfArray<F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
        break;
      case 'date':
        newObj[key] = validateDate<F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
        break;
      case 'datetime':
        newObj[key] = validateDatetime<F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
        break;
      case 'boolean':
        newObj[key] = validateBoolean<F, P, RootFormState>(key, fieldData, formState, props, rootFormState);
        break;
      case 'schema':
        if (fieldData.schema) {
          newObj[key] = validate<F[keyof F], P, RootFormState>((fieldData as any).schema, formState[key], props, rootFormState);
        } else {
          newObj[key] = emptyObj;
        }
        break;
      default:
        throw new Error('Нужно определить функцию для валидации');
    }

    return newObj;
  }, {});

  if (isObject(dependencies)) {
    Object.entries<DependencieFieldValidatorArrType<F, P>>(dependencies).forEach(([name, arrayValidate]) => {
      if (!formError[name]) {
        arrayValidate.some((dependencieValidator) => {
          if (!formError[name]) {
            formError[name] = dependencieValidator(formState[name], formState, props, formState);

            return Boolean(formError[name]);
          }
          return Boolean(formError[name]);
        });
      }
    });
  }

  return formError;
};
