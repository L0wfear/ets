import {
  SchemaType,
  DependencieFieldValidatorArrType,
} from 'components/ui/form/new/@types/validate.h';

import { validateString } from 'components/ui/form/new/string/stringValidate';
import { validateNumber } from 'components/ui/form/new/number/numberValidate';
import { validateValueOfArray } from 'components/ui/form/new/valueOfArray/valueOfArrayValidate';
import { validateDate } from 'components/ui/form/new/date/dateValidate';
import { validateBoolean } from 'components/ui/form/new/boolean/booleanValidate';

import { isObject } from 'util';

export const validate = <F, P>(shema: SchemaType<F, P>, formState: F, props: P): any => {
  const {
    properties,
    dependencies,
  } = shema;

  const formError = properties.reduce<{ [K in keyof F]?: string | null }>((newObj, fieldData) => {
    switch (fieldData.type) {
      case 'string':
        newObj[fieldData.key] = validateString<F, P>(fieldData, formState, props);
        break;
      case 'number':
        newObj[fieldData.key] = validateNumber<F, P>(fieldData, formState, props);
        break;
      case 'valueOfArray':
        newObj[fieldData.key] = validateValueOfArray<F, P>(fieldData, formState, props);
        break;
      case 'date':
        newObj[fieldData.key] = validateDate<F, P>(fieldData, formState, props);
        break;
      case 'boolean':
        newObj[fieldData.key] = validateBoolean<F, P>(fieldData, formState, props);
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
            formError[name] = dependencieValidator(formState[name], formState, props);

            return Boolean(formError[name]);
          }
          return Boolean(formError[name]);
        });
      }
    });
  }

  return formError;
};
