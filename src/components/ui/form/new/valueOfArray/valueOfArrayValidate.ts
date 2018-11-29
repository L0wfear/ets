import { ValueOfArrayPropertie } from 'components/ui/form/new/@types/validate.h';

export const validateValueOfArray = <F, P>(fieldData: ValueOfArrayPropertie<F>, formState: F, props: P) => {
  const {
    [fieldData.key]: value,
  } = formState;

  const {
    title,
  } = fieldData;

  if (fieldData.required && (!value && value !== 0)) {
    return `Поле "${title}" должно быть заполнено`;
  }

  return '';
};
