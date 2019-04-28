import { DateTimePropertie } from 'components/ui/form/new/@types/validate.h';

export const validateDatetime = <K, F, P, RootFormState>(key: keyof F, fieldData: DateTimePropertie<K, F, P>, formState: F, props: P, rootFormState: RootFormState) => {
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
