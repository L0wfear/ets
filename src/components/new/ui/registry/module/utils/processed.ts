import { isNullOrUndefined } from 'util';

export const sortArray = (firstRowData, secondRowData, field) => {
  let [
    first,
    second,
  ] = [
    firstRowData[field],
    secondRowData[field],
  ];

  first = Array.isArray(first) ? first.reduce((newFirst, item) => `${newFirst}, ${item}`, '') : first;
  second = Array.isArray(second) ? second.reduce((newSecond, item) => `${newSecond}, ${item}`, '') : second;

  const firstIsNumber = !isNaN(Number(first));
  const secondIsNumber = !isNaN(Number(second));

  // оба числа
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

  return first.localeCompare(second);
};

export const filterArray = (array, filterValues) => {
  const filterValauesEntries = Object.entries<any>(filterValues);
  if (filterValauesEntries.length > 0) {
    return array.filter((row) => {
      return !filterValauesEntries.some(([valueKeyType, value]) => {    //  если заваливается хотя бы на 1 фильтре
        // описываем проигрышные варианты
        if (valueKeyType.match(/__in$/)) {
          const valueKey = valueKeyType.replace(/__in$/, '');
          return !value.includes(row[valueKey]);
        }
        if (valueKeyType.match(/__like$/)) {
          const valueKey = valueKeyType.replace(/__like$/, '');
          return !row[valueKey].includes(value);
        }
        if (valueKeyType.match(/__eq$/)) {
          const valueKey = valueKeyType.replace(/__eq$/, '');
          return value !== row[valueKey];
        }
        if (valueKeyType.match(/__neq$/)) {
          const valueKey = valueKeyType.replace(/__neq$/, '');
          return !(value !== row[valueKey]);
        }
        if (valueKeyType.match(/__gt$/)) {
          const valueKey = valueKeyType.replace(/__gt$/, '');
          return value >= row[valueKey];
        }
        if (valueKeyType.match(/__lt$/)) {
          const valueKey = valueKeyType.replace(/__lt$/, '');
          return value <= row[valueKey];
        }

        console.log('НЕ ОПРЕДЕЛЕНА ФИЛЬТРАЦИЯ ДЛЯ ТИПА', valueKeyType); // tslint:disable-line:no-console
        return false;
      });
    });
  }

  return [...array];
};

export const makeProcessedArray = (array, { sort, filterValues }) => {
  const processedArray = filterArray(array, filterValues);

  if (sort.field) {
    if (processedArray.some(({ [sort.field]: fieldValue }: any) => !isNullOrUndefined(fieldValue))) {
      processedArray.sort((a, b) => sortArray(a, b, sort.field));

      if (sort.reverse) {
        processedArray.reverse();
      }
    }
  }

  return processedArray;
};
