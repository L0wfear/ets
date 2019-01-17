import { MultiValueOfArrayPropertie } from 'components/ui/form/new/@types/validate.h';
import { isArray } from 'util';

export const validateMultiValueOfArray = <F, P>(fieldData: MultiValueOfArrayPropertie<F>, formState: F, props: P) => {
  const {
    [fieldData.key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && (isArray(value) ? !value.length : !value)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
