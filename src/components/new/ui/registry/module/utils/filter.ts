import { isBoolean } from "util";

export const typeFilter = [
  {
    type: 'in',
    defaultValue: [],
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
      }

      return newObjType;
    }, {});

    return newObj;
  }, {});
};

export const applyFilterFromRaw = ({ rawFilterValues }) => {
  return Object.entries(rawFilterValues).reduce((newObj, [valueKey, typeObjData]) => {
    Object.entries(typeObjData).forEach(([ type, valueData ]) => {
      const { value } = valueData;

      if (!value || isBoolean(value) || Array.isArray(value) && value.length > 0) {
        newObj[`${valueKey}__${type}`] = value;
      }
    });

    return newObj;
  }, {})
};
