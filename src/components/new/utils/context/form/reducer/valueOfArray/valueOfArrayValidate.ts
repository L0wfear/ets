import { FieldValueOFArray } from '../../../@types';

export const validateValueOfArray = <F, K extends keyof F>(key: keyof F, fieldData: FieldValueOFArray<F, K>, formState: F) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !value) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
