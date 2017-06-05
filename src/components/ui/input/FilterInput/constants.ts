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
    label: '=',
  },
  {
    value: FILTER_VALUES.SMALLER,
    label: '<',
  },
  {
    value: FILTER_VALUES.GREATER,
    label: '>',
  },
  {
    value: FILTER_VALUES.NOT_EQUAL,
    label: '≠',
  },
  {
    value: FILTER_VALUES.INTERVAL,
    label: '><',
  },
];
