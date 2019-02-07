import { flattenObject } from 'utils/functions';

export const parseFilterObject = (filter: any) => (
  Object.entries(flattenObject(filter)).reduce((newFilter, [key, { value }]: any) => ({
    ...newFilter,
    [Array.isArray(value) ? `${key}__in` : key]: value,
  }),
  {})
);
