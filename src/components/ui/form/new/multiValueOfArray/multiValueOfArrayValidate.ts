import { MultiValueOfArrayPropertie } from 'components/ui/form/new/@types/validate.h';
import { isArray } from 'util';

export const validateMultiValueOfArray = <F, P>(key: keyof F, fieldData: MultiValueOfArrayPropertie, formState: F, props: P) => {
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
