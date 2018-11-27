import { isString, isNumber } from 'lodash';

export type DefaultSelectOption<V, L> = {
  value: V,
  label: L,
};

export type DefaultSelectListMapper<V, L> = DefaultSelectOption<V, L>[];

export const defaultSelectListMapper = ({ id, name }) => ({ value: id, label: name });

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
