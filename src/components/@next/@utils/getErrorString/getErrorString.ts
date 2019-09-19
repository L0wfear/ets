export const getRequiredFieldMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть заполнено`;
};

export const getRequiredFieldNumberMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть числом`;
};
