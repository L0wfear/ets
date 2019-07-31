import { isBoolean, isArray, isString, isNumber } from 'util';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export const typeFilter = [
  {
    type: 'in',
    defaultValue: [],
  },
  {
    type: 'like',
    defaultValue: '',
  },
  {
    type: 'eq',
    defaultValue: '',
  },
  {
    type: 'gt',
    defaultValue: '',
  },
  {
    type: 'lt',
    defaultValue: '',
  },
  {
    type: 'neq',
    defaultValue: '',
  },
];

export const makeRawFilterValues = (filter) => {
  const {
    rawFilterValues = {},
    fields = [],
  } = filter || {};

  return fields.reduce((newObj, { valueKey }) => {
    newObj[valueKey] = typeFilter.reduce((newObjType, { type, defaultValue }) => {
      if (rawFilterValues && rawFilterValues[valueKey] && rawFilterValues[valueKey][type]) {
        newObjType[type] = {
          ...rawFilterValues[valueKey][type],
        };
      } else {
        newObjType[type] = {
          value: defaultValue,
        };
      }

      return newObjType;
    }, {});

    return newObj;
  }, {});
};

export const setEmptyRawFilters = ({ rawFilterValues }) => {
  return Object.entries(rawFilterValues).reduce((newObj, [valueKey, filterObjByType]) => {
    newObj[valueKey] = typeFilter.reduce((newObjType, { type, defaultValue }) => {
      newObjType[type] = {
        ...filterObjByType[type],
        value: defaultValue,
      };

      return newObjType;
    }, {});

    return newObj;
  }, {});
};

export const applyFilterFromRaw = ({ rawFilterValues }) => {
  return Object.entries(rawFilterValues).reduce((newObj, [valueKey, typeObjData]) => {
    Object.entries(typeObjData).forEach(([ type, valueData ]) => {
      const { value } = valueData;

      const triggerSave = (
        isNumber(value)
        || isBoolean(value)
        || isString(value) && !!value.length
        || (
          value
          && (
            !isArray(value)
            || (
              isArray(value) && !!value.length
            )
          )
        )
      );

      if (triggerSave) {
        newObj[`${valueKey}__${type}`] = value;
      }
    });

    return newObj;
  }, {});
};

export const mergeFilterValuesWithRawFilter = (rawFilterValues: OneRegistryData['filter']['rawFilterValues'], filterValues: OneRegistryData['list']['processed']['filterValues']) => {
  const rawFilterValuesNew = Object.entries(rawFilterValues).reduce(
    (newObj, [key, dataByType]) => {
      newObj[key] = {};
      Object.entries(dataByType).forEach(([type, data]) => {
        const keyFilter = `${key}__${type}`;
        if (keyFilter in filterValues) {
          newObj[key][type] = {
            ...newObj[key][type],
            value: filterValues[keyFilter],
          };
        } else {
          newObj[key][type] = data;
        }
      });

      return newObj;
    },
    {},
  );

  return rawFilterValuesNew;
};
