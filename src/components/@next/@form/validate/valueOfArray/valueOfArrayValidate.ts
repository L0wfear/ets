import { ValueOfArrayField } from 'components/@next/@form/@types';

export const validateValueOfArray = <F extends Record<string, any>>(key: keyof F, fieldData: ValueOfArrayField<F>, formState: F) => {
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
