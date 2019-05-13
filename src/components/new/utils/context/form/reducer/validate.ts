import { isObject, isArray } from 'util';
import { SchemaFormContext, FormErrorBySchema, FieldString, FieldValueOFArray } from '../../@types';
import { validateString } from './string/stringValidate';
import { validateValueOfArray } from './valueOfArray/valueOfArrayValidate';

export const validate = <F, RF>(shemaBody: SchemaFormContext<F>['body'], formState: F): FormErrorBySchema<F, typeof shemaBody, RF> => {
  const formError: FormErrorBySchema<F, typeof shemaBody, RF> = {};

  for (const key in shemaBody.fields) {
    if (key in shemaBody.fields) {
      const fieldData = shemaBody.fields[key];

      if (fieldData.type === 'string') {
        formError[key] = validateString<F, any>(key, fieldData as FieldString<F, any>, formState);
      }
      if (fieldData.type === 'valueOfArray') {
        formError[key] = validateValueOfArray<F, any>(key, fieldData as FieldValueOFArray<F, any>, formState);
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
