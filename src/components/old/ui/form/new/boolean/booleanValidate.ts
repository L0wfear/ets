import { BooleanPropertie } from 'components/old/ui/form/new/@types/validate.h';
import { isBoolean } from 'util';

export const validateBoolean = <K, F, P, RootFormState>(key: keyof F, fieldData: BooleanPropertie<K, F, P>, formState: F, props: P, rootFormState: RootFormState) => {
  const {
    [key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !isBoolean(value)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
