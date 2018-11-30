import { BooleanPropertie } from 'components/ui/form/new/@types/validate.h';
import { isBoolean } from 'util';

export const validateBoolean = <F, P>(fieldData: BooleanPropertie<F>, formState: F, props: P) => {
  const {
    [fieldData.key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && !isBoolean(value)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
