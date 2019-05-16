import { isObject, isArray } from 'util';
import { SchemaFormContext, FormErrorBySchema } from '../@types';
import { validateString } from './string/stringValidate';
import { validateValueOfArray } from './valueOfArray/valueOfArrayValidate';
import { ContextFormField } from '../@types/fields';

/**
 * Set всех stirng полей
 */
const StringSet = new Set<ContextFormField['key']>([
  'name',
]);

/**
 * Set всех valueOfArray полей
 */
const ValueOfArraySet = new Set<ContextFormField['key']>([
  'measure_unit_id',
]);

export const validate = <F>(shemaBody: SchemaFormContext<F>['body'], formState: F): FormErrorBySchema<F> => {
  const formError: FormErrorBySchema<F> = {};

  shemaBody.fields.forEach(
    (fieldsRow) => {
      fieldsRow.forEach(
        (fieldData) => {
          const key = fieldData.key;
          if (StringSet.has(fieldData.key)) {
            formError[key] = validateString<F, any>(key as keyof F, fieldData, formState);
          }
          if (ValueOfArraySet.has(fieldData.key)) {
            formError[key] = validateValueOfArray<F, any>(key as keyof F, fieldData, formState);
          }
        },
      );
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
