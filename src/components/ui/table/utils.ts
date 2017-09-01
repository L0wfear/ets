/**
 * Утилиты для работы с таблицей
 */
import { prop, indexBy } from 'ramda';
import { mapKeys, get, isEmpty, identity, sortBy } from 'lodash';

import { IDataTableSchema, IExtractedDataTableSchema, IDataTableColSchema, ISchemaMaker } from 'components/ui/table/@types/schema.h';

export function extractTableMeta(columnMeta: IDataTableSchema): IExtractedDataTableSchema {
  return indexBy<IDataTableColSchema, IExtractedDataTableSchema>(prop('name'), columnMeta.cols);
}

export function getServerSortingField(sourceField: string, direction: string, serverFieldName: string = null): string {
  const resultField = serverFieldName === null ? sourceField : serverFieldName;

  return `${resultField}:${direction ? 'asc' : 'desc'}`;
}

export function toServerFilteringObject<FilterItem = any>(
  filterObject: ETSCore.Types.IStringKeyHashTable<FilterItem>,
  tableMeta: IExtractedDataTableSchema,
): ETSCore.Types.IStringKeyHashTable<FilterItem> {
  if (isEmpty(tableMeta)) { return filterObject; }

  return mapKeys(filterObject, (value, key) => {
    const serverFieldName = get(tableMeta, [key, 'filter', 'serverFieldName']);

    return serverFieldName === undefined ? key : serverFieldName;
  });
}

export function makeSchema({ cols = [] }: IDataTableSchema, makers: ISchemaMaker): IDataTableSchema {
  const newCols = cols.map(col => {
    const maker = makers[col.name] || identity;
    return maker(col);
  });

  return { cols: newCols };
}

export function sortSchemaCols({ cols = [] }: IDataTableSchema, key: string = 'orderNum'): IDataTableSchema {
  return { cols: sortBy<IDataTableColSchema>(cols, key) };
}

export function hiddeColumns(schema: IDataTableColSchema): IDataTableColSchema {
  return ({ ...schema, display: false });
}

export const getFilterTypeByKey = (key, tableMeta) => {
  const col = tableMeta.cols.find(c => c.name === key);
  const colFilterType = col.filter && col.filter.type ? col.filter.type : '';
  return colFilterType;
};

export const isStringArrayData = (filterValue, fieldValue, fieldKey, tableMeta) =>
  typeof filterValue === 'string' &&
  Array.isArray(fieldValue) &&
  getFilterTypeByKey(fieldKey, tableMeta) === 'string';

export const isNumberSelectArrayData = (filterValue, fieldValue, fieldKey, tableMeta) =>
  typeof filterValue === 'number' &&
  Array.isArray(fieldValue) &&
  getFilterTypeByKey(fieldKey, tableMeta) === 'select';

export const stringArrayDataMatching = (filterValue, fieldValueArray) =>
  fieldValueArray.filter(v => v.match(filterValue) !== null).length > 0;

export const numberArrayDataMatching = (filterValue, fieldValueArray) =>
  fieldValueArray.filter(v => v === filterValue).length > 0;

const floatFormatter = value => parseFloat(value);
const defaultFormatter = value => value;

export const parseAdvancedFilter = (filterObject, key, value, filterType) => {
  const isIntervalFilter = Object.keys(filterObject).length === 2;
  let valueFormatter = defaultFormatter;

  switch (filterType) {
    case 'advanced-number':
      valueFormatter = floatFormatter;
      break;
    default:
  }

  const formattedValue = valueFormatter(value);
  if (isIntervalFilter) {
    const lteValue = valueFormatter(filterObject[`${key}__lte`]);
    const gteValue = valueFormatter(filterObject[`${key}__gte`]);

    if (formattedValue >= gteValue && formattedValue <= lteValue) {
      return true;
    }
  }

  if (`${key}__lt` in filterObject) {
    const ltValue = valueFormatter(filterObject[`${key}__lt`]);

    if (formattedValue < ltValue) {
      return true;
    }
  }

  if (`${key}__gt` in filterObject) {
    const gtValue = valueFormatter(filterObject[`${key}__gt`]);

    if (formattedValue > gtValue) {
      return true;
    }
  }

  if (`${key}__eq` in filterObject) {
    const eqValue = valueFormatter(filterObject[`${key}__eq`]);

    if (formattedValue === eqValue) {
      return true;
    }
  }

  if (`${key}__neq` in filterObject) {
    const neqValue = valueFormatter(filterObject[`${key}__neq`]);

    if (formattedValue !== neqValue) {
      return true;
    }
  }

  return false;
};
