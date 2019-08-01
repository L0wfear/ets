import {
  makeStirngNameFormArray,
  makeStringFromField,
  compareVoids,
  compareNumbers,
  compareStrings,
  sortArray,
} from 'components/@next/@ui/registry/utils/sort/sort';

describe('Тестирование функции сортировки реестра', () => {
  test('Получение значения поля сортировки', () => {
    const field_value_number = 1;
    const field_value_string = '2';
    const field_value_obj_with_number_name = {
      name: field_value_number,
    };
    const field_value_obj_with_string_name = {
      name: field_value_string,
    };

    expect(makeStirngNameFormArray(field_value_number)).toBe(field_value_number);
    expect(makeStirngNameFormArray(field_value_string)).toBe(field_value_string);
    expect(makeStirngNameFormArray(field_value_obj_with_number_name)).toBe(field_value_number);
    expect(makeStirngNameFormArray(field_value_obj_with_string_name)).toBe(field_value_string);
  });

  test('Получение строки/ числа из переменной сортировки', () => {
    const field_value_number = 1;
    const field_value_string = '2';
    const field_value_array_name = [
      {
        name: field_value_number,
      },
      {
        name: field_value_string,
      },
    ];

    expect(makeStringFromField(field_value_number)).toBe(field_value_number);
    expect(makeStringFromField(field_value_string)).toBe(field_value_string);
    expect(makeStringFromField(field_value_array_name)).toBe(`${field_value_number}, ${field_value_string}`);
  });

  test('Сравнение двух возможно пустых значений', () => {
    const a1 = [1, null];
    const a2 = [null, 1];
    const a3 = [null, null];
    const a4 = [1, 2];

    expect(compareVoids(a1[0], a1[1])).toBe(1);
    expect(compareVoids(a2[0], a2[1])).toBe(-1);
    expect(compareVoids(a3[0], a3[1])).toBe(0);
    expect(compareVoids(a4[0], a4[1])).toBeFalsy();
  });

  test('Сравнение двух чисел', () => {
    const a1 = [1, 2];
    const a2 = [2, 1];
    const a3 = [1, 1];
    const a4 = [1, null];
    const a5 = [null, 1];

    expect(compareNumbers(a1[0], a1[1])).toBe(-1);
    expect(compareNumbers(a2[0], a2[1])).toBe(1);
    expect(compareNumbers(a3[0], a3[1])).toBe(0);
    expect(compareNumbers(a4[0], a4[1])).toBe(1);
    expect(compareNumbers(a5[0], a5[1])).toBe(-1);
  });

  test('Сравнение двух чисел', () => {
    const a1 = ['a', 'b'];
    const a2 = ['b', 'a'];
    const a3 = ['A', 'a'];
    const a4 = ['2', '2'];
    const a5 = ['2', '1'];
    const a6 = ['12', '2'];
    const a7 = ['22', '2'];

    expect(compareStrings(a1[0], a1[1])).toBe(-1);
    expect(compareStrings(a2[0], a2[1])).toBe(1);
    expect(compareStrings(a3[0], a3[1])).toBe(0);
    expect(compareStrings(a4[0], a4[1])).toBe(0);
    expect(compareStrings(a5[0], a5[1])).toBe(1);
    expect(compareStrings(a6[0], a6[1])).toBe(-1);
    expect(compareStrings(a7[0], a7[1])).toBe(1);
  });

  test('Сортировка двух массивов', () => {
    const arrayToSort = [
      {
        field_sort_number: 1,
        field_sort_string: 'a',
        field_sort_date: '2019-05-21T16:12:50',
        field_sort_array: [
          {
            name: 1,
          },
          {
            name: 12,
          },
        ],
      },
      {
        field_sort_number: 2,
        field_sort_string: 'A',
        field_sort_date: '2019-06-21T16:12:50',
        field_sort_array: [
          {
            name: '2',
          },
          {
            name: '12',
          },
        ],
      },
      {
        field_sort_number: 1,
        field_sort_string: 'b',
        field_sort_date: '2019-05-21T16:12:50',
        field_sort_array: [
          {
            name: 2,
          },
          {
            name: 'a2',
          },
        ],
      },
      {
        field_sort_number: null,
        field_sort_string: null,
        field_sort_date: null,
        field_sort_array: [
          {
            name: null,
          },
          {
            name: null,
          },
        ],
      },
    ];

    const sortArrayListByNumber = [...arrayToSort].sort(
      (a, b) => sortArray(a, b, 'field_sort_number'),
    );
    const sortArrayListByString = [...arrayToSort].sort(
      (a, b) => sortArray(a, b, 'field_sort_string'),
    );
    const sortArrayListByArrayName = [...arrayToSort].sort(
      (a, b) => sortArray(a, b, 'field_sort_array'),
    );
    const sortArrayListByDate = [...arrayToSort].sort(
      (a, b) => sortArray(a, b, 'field_sort_date'),
    );

    expect(sortArrayListByNumber.map((d) => d.field_sort_number).join()).toBe(',1,1,2');
    expect(sortArrayListByString.map((d) => d.field_sort_string).join().toLocaleLowerCase()).toBe(',a,a,b');
    expect(
      sortArrayListByArrayName.map(
        (d) => d.field_sort_array.map(
          (dd) => dd.name,
        ).join(''),
      ).join(),
    ).toBe(',112,212,2a2');
    expect(sortArrayListByDate.map((d) => d.field_sort_date).join()).toBe(',2019-05-21T16:12:50,2019-05-21T16:12:50,2019-06-21T16:12:50');
  });
});
