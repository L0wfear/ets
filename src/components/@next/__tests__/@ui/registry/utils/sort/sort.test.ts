import {
  makeStirngNameFormArray,
  makeStringFromField,
  compareVoids,
  // compareNumbers,
  // compareStrings,
  // sortArray,
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
});
