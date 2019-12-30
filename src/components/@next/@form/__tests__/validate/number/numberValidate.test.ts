import { validateNumber } from 'components/@next/@form/validate/number/numberValidate';
import { NumberField } from 'components/@next/@form/@types';

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
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultSmallNubmer))).toBeTruthy();
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
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithBiggestNumber))).toBeTruthy();
    expect(Boolean(validateNumber('number', configWithSimple, formStateWithDefaultSmallNubmer))).toBeFalsy();
  });
});
