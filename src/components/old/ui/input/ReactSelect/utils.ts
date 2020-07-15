import { isString, isNumber } from 'lodash';

export type DefaultSelectOption<V, L, R> = {
  value: V;
  label: L;
  rowData?: Partial<R>;
  isNotVisible?: boolean;
  [k: string]: any;
};

export type DefaultSelectListMapper<R extends any> = Array<DefaultSelectOption<R['id'], R['name'], R>>;

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
  } else {
    if (multi) {
      newValue = [];
    }
  }

  return newValue;
};

export const defaultSortingFunction = (a, b) => {
  if (isNumber(a.label)) {
    return a.label - b.label;
  }

  if (isString(a.label) && !isNaN(a.label.replace(',', '.'))) {
    return Number(a.label.replace(',', '.')) - Number(b.label.replace(',', '.'));
  }

  if (isString(a.label) && isString(b.label)) {
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  }

  return a.label - b.label;
};

export const geContainertId = (id: string, modalKey?: string, ) => {
  return id ? `${modalKey ? `${modalKey}-` : ''}${id}-container` : undefined;
};
export const getValueId = (id: string, modalKey?: string, ) => {
  return id ? `${modalKey ? `${modalKey}-` : ''}${id}-value` : undefined;
};
export const getInstanceId = (id: string, modalKey?: string, ) => {
  return modalKey ? `${modalKey}-${id}` : id;
};
export const getMultiValueId = (id: string, modalKey: string, value: any) => {
  const instanceId = getInstanceId(id, modalKey);
  return instanceId ? `${instanceId}-value-${value}` : undefined;
};