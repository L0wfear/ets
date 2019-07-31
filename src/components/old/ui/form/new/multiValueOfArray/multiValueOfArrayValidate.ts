import { MultiValueOfArrayPropertie } from 'components/old/ui/form/new/@types/validate.h';
import { isArray } from 'util';

export const validateMultiValueOfArray = <K, F, P, RootFormState>(key: keyof F, fieldData: MultiValueOfArrayPropertie<K, F, P>, formState: F, props: P, rootFormState: RootFormState) => {
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
