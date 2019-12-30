import { validateNumber } from 'components/@next/@form/validate/number/numberValidate';
import { NumberField } from 'components/@next/@form/@types';
import {
  getRequiredFieldNumberMoreThenZero,
  getRequiredFieldNumberMoreThen,
  getMoreOrEqualError,
  getAltMinError,
  getMaxLengthError,
  getMinLengthError,
} from 'components/@next/@utils/getErrorString/getErrorString';

describe('Проверка валидации формы по number', () => {
  test('Проверка обязательности заполнения числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithZero = {
      number: 0,
    };
    const formStateWithDefaultValue = {
      number: 1,
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
    };
    const configWithRequired: NumberField<typeof formStateWithNull, 'number'> = {
      ...configWithSimple,
      required: true,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithZero))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultValue))).toBeFalsy();

    expect(Boolean(validateNumber('number', configWithRequired, formStateWithNull))).toBeTruthy();
    expect(Boolean(validateNumber('number', configWithRequired, formStateWithZero))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithRequired, formStateWithDefaultValue))).toBeFalsy();
  });
  test('Проверка на ввод числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithNumber = {
      number: 1,
    };
    const formStateWithDefaultString = {
      number: '1',
    };
    const formStateWithDefaultFloatString = {
      number: '1.1',
    };
    const formStateWithDefaultFloatString2 = {
      number: '1,1',
    };
    const formStateWithDefaultErrorString = {
      number: '1ssss1',
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNumber))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultString))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultFloatString))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultFloatString2))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultErrorString))).toBeTruthy();
  });

  test('Проверка на минимальную длину числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithNumber = {
      number: 10,
    };
    const formStateWithDefaultSmallNubmer = {
      number: 9,
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      minLength: 2,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNumber))).toBeFalsy();
    expect(validateNumber('number', configWithSimple, formStateWithDefaultSmallNubmer)).toBe(getMinLengthError(configWithSimple.minLength));
  });

  test('Проверка на максимальную длину числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithBiggestNumber = {
      number: 100,
    };
    const formStateWithDefaultSmallNubmer = {
      number: 99,
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      maxLength: 2,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(validateNumber('number', configWithSimple, formStateWithBiggestNumber)).toBe(getMaxLengthError(configWithSimple.maxLength));
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultSmallNubmer))).toBeFalsy();
  });

  test('Проверка на минимальное значение числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithBiggestNumber = {
      number: 10,
    };
    const formStateWithDefaultSmallNubmer = {
      number: 9,
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      min: 10,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithBiggestNumber))).toBeFalsy();
    expect(validateNumber('number', configWithSimple, formStateWithDefaultSmallNubmer)).toBe(getMoreOrEqualError(configWithSimple.title, configWithSimple.min));
  });

  test('Проверка на минимальное значение числа (alt_min)', () => {
    const formState1 = {
      number: 0,
    };

    const configWithSimple: NumberField<typeof formState1, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      min: 1,
      alt_min: true,
    };
    const configWithSimple2: NumberField<typeof formState1, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      min: 1,
      max: 10,
      alt_min: true,
    };

    expect(validateNumber('number', configWithSimple, formState1)).toBe(getMoreOrEqualError(configWithSimple.title, configWithSimple.min));
    expect(validateNumber('number', configWithSimple2, formState1)).toBe(getAltMinError(configWithSimple.title, configWithSimple2.max));
  });

  test('Проверка на минимальное не равное значение числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithBiggestOrEqualNumber = {
      number: 10,
    };
    const formStateWithDefaultSmallNubmer = {
      number: 9,
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      minNotEqual: 9,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithBiggestOrEqualNumber))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultSmallNubmer))).toBeTruthy();
  });

  test('Проверка на минимальное не равное значение числа -1', () => {
    const formStateSimple = {
      number: 0,
    };
    const formStateSimple2 = {
      number: -1,
    };

    const configWithSimple: NumberField<typeof formStateSimple, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      minNotEqual: 0,
    };
    const configWithSimple2: NumberField<typeof formStateSimple2, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      minNotEqual: -1,
    };

    expect(validateNumber('number', configWithSimple, formStateSimple)).toBe(getRequiredFieldNumberMoreThen(configWithSimple.title, configWithSimple.minNotEqual));
    expect(validateNumber('number', configWithSimple2, formStateSimple2)).toBe(getRequiredFieldNumberMoreThenZero(configWithSimple2.title));
  });

  test('Проверка на масимально значение числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithBiggestNumber = {
      number: 10,
    };
    const formStateWithDefaultSmallNubmer = {
      number: 9,
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      max: 9,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithBiggestNumber))).toBeTruthy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultSmallNubmer))).toBeFalsy();
  });

  test('Проверка на целочисленное значение числа', () => {
    const formStateWithNull = {
      number: null,
    };
    const formStateWithNormal = {
      number: 10,
    };
    const formStateWithFloat = {
      number: 10.1,
    };

    const configWithSimple: NumberField<typeof formStateWithNull, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      integer: true,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithNormal))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithFloat))).toBeTruthy();
  });

  test('Проверка на валидацию по регуляному значению', () => {
    const formState = {
      number: 10,
    };

    const configWithSimple: NumberField<typeof formState, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      regexp: '[0-9]',
      regexpErrorText: 'Some error',
    };
    const configWithErrorSimple: NumberField<typeof formState, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      regexp: '[a-z]',
      regexpErrorText: 'Some error',
    };

    expect(Boolean(validateNumber('number', configWithSimple, formState))).toBeFalsy();
    expect(validateNumber('number', configWithErrorSimple, formState)).toBe(configWithErrorSimple.regexpErrorText);
  });

  test('Проверка на кол-во чисел после запятой', () => {
    const formState = {
      number: 10,
    };
    const formState1 = {
      number: 10.1,
    };
    const formState2 = {
      number: 10.11,
    };

    const configWithSimple: NumberField<typeof formState, 'number'> = {
      title: 'Тестовое число',
      type: 'number',
      float: 1,
    };

    expect(Boolean(validateNumber('number', configWithSimple, formState))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formState1))).toBeFalsy();
    expect(Boolean(validateNumber('number', configWithSimple, formState2))).toBeTruthy();
  });
});
