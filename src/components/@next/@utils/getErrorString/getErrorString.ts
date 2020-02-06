export const getRequiredFieldMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть заполнено`;
};

export const getRequiredFieldNumberMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть числом`;
};

export const getRequiredFieldStringMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" должно быть строкой`;
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

export const getRequiredFieldToFixed = (field = 'Название по умолчанию', countMark: number) => {
  return `Поле "${field}" должно быть неотрицательным числом с ${countMark} знаками после запятой`;
};

export const getNoTrimSpaceMessage = (field = 'Название по умолчанию') => {
  return `Поле "${field}" не должно начинаться или закачиваться пробелом`;
};

export const getRequiredFieldDateMoreThen = (field = 'Название по умолчанию', date: string) => {
  return `"${field}" должна быть позже ${date}`;
};

export const getAltMinError = (field = 'Название по умолчанию', max = 0) => {
  return `Поле "${field}" должно быть неотрицательным числом и меньше ${max}`;
};

export const getMoreOrEqualError = (field = 'Название по умолчанию', min = 0) => {
  return `Поле "${field}" должно быть больше либо равно ${min}`;
};

export const getMinLengthError = (minLength = 0) => {
  return `Длина поля должна быть больше минимального количества символов (${minLength})`;
};

export const getMaxLengthError = (maxLength = 0) => {
  return `Длина поля не должна превышать максимальное количество символов (${maxLength})`;
};

export const getFixedLengthCollectionError = (fixedLengthCollection: Array<number>) => {
  return `Длина поля быть равной одному из значений (${fixedLengthCollection.join(', ')})`;
};

