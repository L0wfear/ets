import { isString } from 'util';

export const getNumberValueFromSerch = (value: string | number | null) => {
  return isString(value) ? Number(value) : value;
};
