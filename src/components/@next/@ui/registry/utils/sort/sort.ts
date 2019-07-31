import {
  isString,
  isNumber,
  isArray,
} from "util";
// import { diffDates } from "utils/dates";

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

export const makeStringFromField = (value: number | string | ObjWithName[]) => {
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
// export const compareNumbers = (first: number, second: number) => {
//   return first - second;
// };
// };
// export const compareStrings = (first: string, second: string) => {
//   const first_string = first.toLocaleLowerCase().trim();
//   const second_string = first.toLocaleLowerCase().trim();

//   return first_string.localeCompare(
//     second_string,
//   );
// };

// export const sortArray = (firstRowData, secondRowData, field) => {
//   const first = makeStringFromField(firstRowData[field]);
//   const second = makeStringFromField(secondRowData[field]);

//   const hasEmptyData = compareVoids(first, second);
//   if (hasEmptyData !== false) {
//     return hasEmptyData;
//   }

//   // оба числа
//   if (isNumber(first) && isNumber(second)) {
//     return compareNumbers(first, second);
//   }

//   // обе строки
//   if (isString(first) && isString(second)) {
//     // обе даты
//     if (first.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))|([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)/)) {
//       return diffDates(first, second);
//     }

//     return compareStrings(first, second);
//   }

//   return 0;
// };
