import { isString, isNumber } from 'lodash';

export type DefaultSelectOption<V, L, R> = {
  value: V,
  label: L,
  rowData: R,
};

export type DefaultSelectListMapper<V, L, R> = DefaultSelectOption<V, L, R>[];

export const defaultSelectListMapper = ({ id, name, ...other }) => ({ value: id, label: name, rowData: { id, name, ...other } });
// export const customSelectListMapper = (optionElementScheme) => (optionElementScheme);

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
