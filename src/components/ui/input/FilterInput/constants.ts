export const FILTER_VALUES = {
  EQUAL: 'eq',
  NOT_EQUAL: 'neq',
  GREATER: 'gt',
  SMALLER: 'lt',
  INTERVAL: 'interval',
  LIKE: 'like',
};

export const FILTER_SELECT_TYPES = [
  {
    value: FILTER_VALUES.EQUAL,
    label: 'равно',
  },
  {
    value: FILTER_VALUES.SMALLER,
    label: 'меньше',
  },
  {
    value: FILTER_VALUES.GREATER,
    label: 'больше',
  },
  {
    value: FILTER_VALUES.NOT_EQUAL,
    label: 'не равно',
  },
  {
    value: FILTER_VALUES.INTERVAL,
    label: 'диапазон',
  },
];
