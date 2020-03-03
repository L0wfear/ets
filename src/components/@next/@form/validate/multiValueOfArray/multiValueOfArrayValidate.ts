import { MultiValueOfArrayField } from 'components/@next/@form/@types';
import { isArray } from 'util';

export const validateMultiValueOfArray = <F extends Record<string, any>>(key: keyof F, fieldData: MultiValueOfArrayField<F>, formState: F) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && (isArray(value) ? !value.length : !value)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
