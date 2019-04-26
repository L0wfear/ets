import { isString, isNumber } from 'lodash';

export type DefaultSelectOption<V, L, R> = {
  value: V,
  label: L,
  rowData: Partial<R>,
  [k: string]: any;
};

export type DefaultSelectListMapper<R extends any> = DefaultSelectOption<R['id'], R['name'], R>[];

export const defaultSelectListMapper = <R extends any>(rowData: R): DefaultSelectOption<R['id'], R['name'], R> => ({ value: rowData.id, label: rowData.name, rowData });

export const onChangeSelectLegacy = (sValue, multi) => {
  let newValue = null;

  if (sValue) {
    if (Array.isArray(sValue)) {
      if (!multi && !sValue.length) {
        newValue = null;
      } else {
        newValue = sValue.map(({ value }) => value);
      }
    } else {
      newValue = sValue.value;
    }
  }

  return newValue;
};

export const defaultSortingFunction = (a, b) => {
  if (isNumber(a.label)) {
    return a.label - b.label;
  }

  if (isString(a.label) && isString(b.label)) {
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  }

  return a.label - b.label;
};
