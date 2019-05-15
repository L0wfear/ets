import { isObject, isArray } from 'util';
import { SchemaFormContext, FormErrorBySchema } from '../../@types';
import { validateString } from './string/stringValidate';
import { validateValueOfArray } from './valueOfArray/valueOfArrayValidate';
import { FieldValueOFArrayCommon } from '../../@types/fields/valueOfArray';
import { FieldStringCommon } from '../../@types/fields/string';

/**
 * Set всех stirng полей
 */
const StringSet = new Set<ValuesOf<SchemaFormContext<any>['body']['fields']>['key']>([
  'name',
]);

/**
 * Set всех valueOfArray полей
 */
const ValueOfArraySet = new Set<ValuesOf<SchemaFormContext<any>['body']['fields']>['key']>([
  'measure_unit_id',
]);

export const validate = <F, RF>(shemaBody: SchemaFormContext<F>['body'], formState: F): FormErrorBySchema<F, typeof shemaBody, RF> => {
  const formError: FormErrorBySchema<F, typeof shemaBody, RF> = {};

  for (const key in shemaBody.fields) {
    if (key in shemaBody.fields) {
      const fieldData = shemaBody.fields[key];

      if (StringSet.has(fieldData.key)) {
        formError[key] = validateString<F, any>(key as keyof F, fieldData as FieldStringCommon<F, any>, formState);
      }
      if (ValueOfArraySet.has(fieldData.key)) {
        formError[key] = validateValueOfArray<F, any>(key as keyof F, fieldData as FieldValueOFArrayCommon<F, any>, formState);
      }
    }
  }

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
