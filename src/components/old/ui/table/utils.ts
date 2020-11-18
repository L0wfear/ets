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
const dateFormatter = (value) => (
  /^(\d{2}\.){2}\d{4}\s\d{2}:\d{2}$/.test(value)
    ? value.split(' ')
      .map((el, i) => {
        if(i === 0) {
          return el.split('.').reverse().join('-');
        }
        return `${el}:00`;
      })
      .join('T')
    : value
);

const formattedTimeValue = (value) => {
  if (isString(value) && value.includes(':')) {
    return Number(value.replace(':', '.'));
  } else {
    return value;
  }
};

export const parseAdvancedFilter = (filterObject, key, value, filterType) => {
  const isIntervalFilter = Object.keys(filterObject).length === 2;
  let valueFormatter = defaultFormatter;

  switch (filterType) {
    case 'advanced-number':
      valueFormatter = floatFormatter;
      break;
    default:
  }

  const formattedValue = filterType === 'advanced-datetime' ? dateFormatter(value) : valueFormatter(formattedTimeValue(value));
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

  const firstIsNumber = !isNaN(Number(first)) && typeof first === 'number';
  const secondIsNumber = !isNaN(Number(second)) && typeof second === 'number';

  const firstIsNullOrUndefined = first === null || first === undefined;
  const secondIsNullOrUndefined = second === null || second === undefined;

  const firstIsString = typeof first === 'string';
  const secondIsString = typeof second === 'string';

  if (isString(firstRowData) && isString(secondRowData) && first.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))|([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)/)) {
    return diffDates(first, second);
  }
  if (firstIsNullOrUndefined && secondIsNullOrUndefined) {
    return 0;
  }

  if (firstIsNumber && secondIsNumber) {
    return first - second;
  }
  //одно из значений null или undefined
  if (
    (firstIsNumber || secondIsNumber)
    || (firstIsString || secondIsString) 
    && (firstIsNullOrUndefined || secondIsNullOrUndefined) 
  ) {
    return firstIsNullOrUndefined ? -1 : 1;
  }
  //столбцы с символьными значениями
  if (firstIsString && secondIsString) {
    if (first === second) {
      return 0;
    }
    if (first === '' || second === '') {
      return first === '' ? -1 : 1;
    }
    const typesRegExps = {
      space: /\s/,
      punctuation: /[,.-]/,
      character: /[А-Я]/i,
      num: /\d/,
    };

    const firstString = first.split('');
    const secondString = second.split('');
    const count = firstString.length < secondString.length ? firstString.length - 1 : secondString.length - 1;

    for (let i = 0; i <= count; i++) {
      const typeOfFirst = Object.keys(typesRegExps).find((key) => typesRegExps[key].test(firstString[i]));
      const typeOfSecond = Object.keys(typesRegExps).find((key) => typesRegExps[key].test(secondString[i]));

      if (typeOfFirst === 'space' || typeOfSecond === 'space') {
        if(first !== second) {
          return typeOfFirst === 'space' ? -1 : 1;
        }
      }

      if (typeOfFirst === 'punctuation' || typeOfSecond === 'punctuation') {
        if (typeOfFirst !== typeOfSecond) {
          return typeOfFirst === 'punctuation' ? -1 : 1;
        }
        if(firstString[i] !== secondString[i]) {
          return firstString[i] > secondString[i] ? -1 : 1;
        }
      }

      if (typeOfFirst === 'num' || typeOfSecond === 'num') {
        if (typeOfFirst !== typeOfSecond) {
          return typeOfFirst === 'num' ? -1 : 1;
        }
        if (firstString[i] !== secondString[i]) {
          return firstString[i] < secondString[i] ? -1 : 1; 
        }
      }

      if (i === count) {
        if (firstString[i] === secondString[i]) {
          return firstString.length < secondString.length ? -1 : 1;
        }
      }

      if(firstString[i] !== secondString[i]) {
        return firstString[i] < secondString[i] ? -1 : 1;
      }
    }
  }
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
