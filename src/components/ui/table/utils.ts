/**
 * Утилиты для работы с таблицей
 */
import { prop, indexBy } from 'ramda';
import { mapKeys, get, isEmpty, identity, sortBy } from 'lodash';

import { IDataTableSchema, IExtractedDataTableSchema, IDataTableColSchema, ISchemaMaker } from 'components/ui/table/@types/schema.h';
import { isString, isArray } from 'util';
import { diffDates } from 'utils/dates';

export function extractTableMeta(columnMeta: IDataTableSchema): IExtractedDataTableSchema {
  return indexBy<IDataTableColSchema>(prop('name'), columnMeta.cols);
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
  const newCols = cols.map((col) => {
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
  const col = tableMeta.cols.find((c) => c.name === key);
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
  fieldValueArray.filter((v) => v.match(filterValue) !== null).length > 0;

export const numberArrayDataMatching = (filterValue, fieldValueArray) =>
  fieldValueArray.filter((v) => v === filterValue).length > 0;

const floatFormatter = (value) => parseFloat(value);
const defaultFormatter = (value) => value;

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

export const sortFunction = (firstRowData, secondRowData, initialSort, other) => {
  let [
    first,
    second,
  ] = [
    firstRowData[initialSort],
    secondRowData[initialSort],
  ];

  first = Array.isArray(first) ? first.reduce((newFirst, item) => `${newFirst}, ${item}`, '') : first;
  second = Array.isArray(second) ? second.reduce((newSecond, item) => `${newSecond}, ${item}`, '') : second;

  const firstIsNumber = !isNaN(Number(first));
  const secondIsNumber = !isNaN(Number(second));
  // оба числа

  if (isString(firstRowData) && isString(secondRowData) && first.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))|([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)/)) {
    return diffDates(first, second);
  }

  if (firstIsNumber && secondIsNumber) {
    return first - second;
  }
  if (!firstIsNumber || !secondIsNumber) {
    if (!first && first !== 0) {
      return -1;
    }
    if (!second && second !== 0) {
      return 1;
    }
  }
  // первое - не число
  if (!firstIsNumber && secondIsNumber) {
    return -1;
  }
  // второе - не число
  if (firstIsNumber && !secondIsNumber) {
    return 1;
  }
  // оба элемента пусты ('', null, undefined)
  if (!first && !second) {
    return 0;
  }
  if (!first && second) {
    return -1;
  }
  if (first && !second) {
    return 1;
  }

  return first.toLocaleLowerCase().trim().localeCompare(second.toLocaleLowerCase().trim());
};

export const sortData = (data, { initialSort, initialSortAscending, ...other }) => (
  initialSort
  ? (
    data.sort((a, b) => (
      sortFunction(initialSortAscending ? a : b, initialSortAscending ? b : a, initialSort, other)),
    )
  )
  : (
    data
  )
);

export const makeData = (data, prevProps, nextProps) => {
  const deepArr = data.some(({ rows }) => isArray(rows));

  if (deepArr) {
    return data.map((dataBlock) => ({
        ...dataBlock,
        rows: makeData(dataBlock.rows, prevProps, nextProps),
    }));
  }

  let returnData = data;

  const { tableMeta: { cols = [] } = {} } = nextProps;
  const colData = cols.find(({ name }) => name === nextProps.initialSort);
  if (colData && colData.sortFunc) {
    returnData = [...returnData].sort((a, b) => nextProps.initialSortAscending ? colData.sortFunc(a, b) : colData.sortFunc(b, a));
  } else {
    returnData = sortData([...returnData], nextProps);
  }

  return returnData;
};
