import {
  isString,
  isNumber,
  isArray,
} from 'util';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

type ObjWithName = {
  name: string | number;
  [k: string]: any;
};
export const makeStirngNameFormArray = (item: string | number | ObjWithName) => {
  if (isString(item) || isNumber(item)) {
    return item;
  }

  return item.name;
};

export const makeStringFromField = (value: number | string | Array<ObjWithName> | any) => {
  if (isArray(value)) {
    return value.map((item) => makeStirngNameFormArray(item)).join(', ');
  }

  return value;
};

export const compareVoids = (first: any, second: any) => {
  // оба элемента пусты
  if (!first && !second) {
    return 0;
  }

  // если одного значение не заполнено
  if (!first && second) {
    return -1;
  }
  if (first && !second) {
    return 1;
  }

  return false;
};
export const compareNumbers = (first: number, second: number) => {
  const diff = first - second;
  return (
    diff < 0
      ? -1
      : diff > 0
        ? 1
        : 0
  );
};

export const compareStrings = (first: string, second: string) => {
  const first_string = first.toLocaleLowerCase().trim();
  const second_string = second.toLocaleLowerCase().trim();

  return first_string.localeCompare(
    second_string,
  );
};

export const sortArrayFunc = <T extends any>(firstRowData: T, secondRowData: T, field: keyof T) => {
  const first = makeStringFromField(firstRowData[field]);
  const second = makeStringFromField(secondRowData[field]);

  const hasEmptyData = compareVoids(first, second);
  if (hasEmptyData !== false) {
    return hasEmptyData;
  }

  // оба числа
  if (isNumber(first) && isNumber(second)) {
    return compareNumbers(first, second);
  }

  // обе строки
  if (isString(first) && isString(second)) {
    // обе даты
    if (first.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))|([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)/)) {
      return diffDates(first, second);
    }

    return compareStrings(first, second);
  }

  return 0;
};

export const sortArray = <F extends any>(array: OneRegistryData<F>['list']['data']['array'], sort: OneRegistryData<F>['list']['processed']['sort']): Array<F> => {
  const newArray = [...array];

  if (sort.field) {
    newArray.sort(
      (a, b) => (
        sortArrayFunc(
          sort.reverse ? b : a,
          sort.reverse ? a : b,
          sort.field,
        )
      ),
    );
  }

  return newArray;
};
