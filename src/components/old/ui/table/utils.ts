/**
 * Утилиты для работы с таблицей
 */
import { isString, isArray } from 'util';
import { toArray } from 'lodash';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { validate } from 'components/old/ui/form/new/validate';

export const getFilterTypeByKey = (key, tableMeta) => {
  const col = tableMeta.cols.find((c) => c.name === key);
  const colFilterType = col.filter && col.filter.type ? col.filter.type : '';
  return colFilterType;
};

export const isStringArrayData = (filterValue, fieldValue, fieldKey, tableMeta) =>
  typeof filterValue === 'string'
  && Array.isArray(fieldValue)
  && getFilterTypeByKey(fieldKey, tableMeta) === 'string';

export const isNumberSelectArrayData = (filterValue, fieldValue, fieldKey, tableMeta) =>
  typeof filterValue === 'number'
  && Array.isArray(fieldValue)
  && getFilterTypeByKey(fieldKey, tableMeta) === 'select';

export const stringArrayDataMatching = (filterValue: string, fieldValueArray: Array<string>) =>
  fieldValueArray.join().includes(filterValue.split(', ').join());

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

    if (formattedValue > gteValue && formattedValue < lteValue) {
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

export const DataTableInputOutputListErrors = (inputList: Array<any>, outputListErrors: Array<any>, validationSchema: SchemaType<any, any>) => {
  return inputList.map((rowData, i) => {
    return {
      ...outputListErrors[i],
      ...validate(
        validationSchema,
        rowData,
        {},
        rowData,
      ),
    };
  });
};

export const isValidDataTableInput = ( outputListErrors: Array<any>): boolean =>
  !outputListErrors.map((errorItem) => {
    return toArray(errorItem)
      .map((v) => !!v)
      .filter((ev) => ev === true)
      .length;
  }).some((value) => value > 0);
