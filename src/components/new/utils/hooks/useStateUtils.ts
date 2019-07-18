import { isString } from 'util';

export const getNumberValueFromSerch = (value: string | number | null) => {
  return isString(value) ? Number(value) : value;
};

export const getBooleanValueFromSerch = (value: string | number | null) => {
  return value === 'true' ? true : false;
};

export const getStringArrValueFromSerch = (value: string | null) => {
  return isString(value) ? [value] : value;
};
