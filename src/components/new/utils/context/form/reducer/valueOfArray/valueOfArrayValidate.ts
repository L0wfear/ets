import { FieldValueOFArrayCommon } from "../../../@types/fields/valueOfArray";

export const validateValueOfArray = <F, K extends keyof F>(key: keyof F, fieldData: FieldValueOFArrayCommon<F, K>, formState: F) => {
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
