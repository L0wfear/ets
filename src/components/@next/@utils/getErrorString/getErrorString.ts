export const getRequiredFieldMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть заполнено`;
};

export const getRequiredFieldNumberMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть числом`;
};

export const getRequiredFieldNumberMoreThen = (field = 'Название по умолчанию', number: number) => {
  return `Поле "${field}" должно быть больше ${number}`;
};

export const getRequiredFieldNumberMoreThenZero = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть неотрицательным числом`;
};

export const getRequiredFieldNoTrim = (field = 'Название по умолчанию') => {
  return `Поле "${field}" не должно начинаться и заканчиваться пробелом`;
};

export const getRequiredFieldMoreEqualThen = (field1 = 'Название по умолчанию', field2 = 'Название по умолчанию') => {
  return `Поле "${field1}" должно быть меньше либо равно поля "${field2}"`;
};

export const getRequiredFieldToFixed = (field = 'Название по умолчанию', countMark) => {
  return `Поле "${field}" должно быть неотрицательным числом с ${countMark} знаками после запятой`;
};
