export const getRequiredFieldMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть заполнено`;
};

export const getRequiredFieldNumberMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть числом`;
};

export const getRequiredFieldNumberMoreThen = (field = 'Название по умолчанию', number: number) => {
  return `Поле "${field}" должно быть больше ${number}`;
};
