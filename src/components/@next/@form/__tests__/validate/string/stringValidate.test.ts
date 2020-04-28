import { validateString } from 'components/@next/@form/validate/string/stringValidate';
import { StringField } from 'components/@next/@form/@types';
import { getRequiredFieldMessage, getMaxLengthError, getMinLengthError, getRequiredFieldNoTrim, getRequiredFieldStringMessage } from 'components/@next/@utils/getErrorString/getErrorString';

describe('Проверка валидации формы по string', () => {
  test('Проверка обязательности заполнения строки', () => {
    const formStateWithNull = {
      string: null,
    };
    const formStateWithZero = {
      string: '',
    };
    const formStateWithDefaultValue = {
      string: 'word',
    };

    const configWithSimple: StringField<typeof formStateWithNull, 'string'> = {
      title: 'Тестовая строка',
      type: 'string',
    };
    const configWithRequired: StringField<typeof formStateWithNull, 'string'> = {
      ...configWithSimple,
      required: true,
    };

    expect(Boolean(validateString('string', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateString('string', configWithSimple, formStateWithZero))).toBeFalsy();
    expect(Boolean(validateString('string', configWithSimple, formStateWithDefaultValue))).toBeFalsy();

    expect(validateString('string', configWithRequired, formStateWithNull)).toBe(getRequiredFieldMessage(configWithRequired.title));
    expect(validateString('string', configWithRequired, formStateWithZero)).toBe(getRequiredFieldMessage(configWithRequired.title));
    expect(Boolean(validateString('string', configWithRequired, formStateWithDefaultValue))).toBeFalsy();
  });

  test('Проверка на минимальную длину строки', () => {
    const formStateWithNull = {
      string: null,
    };
    const formStateWithString = {
      string: 'aa',
    };
    const formStateWithSmallString = {
      string: 'b',
    };

    const configWithSimple: StringField<typeof formStateWithNull, 'string'> = {
      title: 'Тестовая строка',
      type: 'string',
      minLength: 2,
    };

    expect(Boolean(validateString('string', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateString('string', configWithSimple, formStateWithString))).toBeFalsy();
    expect(validateString('string', configWithSimple, formStateWithSmallString)).toBe(getMinLengthError(configWithSimple.minLength));
  });

  test('Проверка на максимальную длину строки', () => {
    const formStateWithNull = {
      string: null,
    };
    const formStateWithBiggestString = {
      string: 'aaa',
    };
    const formStateWithSmallString = {
      string: 'bb',
    };

    const configWithSimple: StringField<typeof formStateWithNull, 'string'> = {
      title: 'Тестовая строка',
      type: 'string',
      maxLength: 2,
    };

    expect(Boolean(validateString('string', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(validateString('string', configWithSimple, formStateWithBiggestString)).toBe(getMaxLengthError(configWithSimple.maxLength));
    expect(Boolean(validateString('string', configWithSimple, formStateWithSmallString))).toBeFalsy();
  });

  test('Проверка на пробелы вокруг строки', () => {
    const formStateWithNull = {
      string: null,
    };
    const formState = {
      string: 'aaa',
    };
    const formStateWithSpaceBefore = {
      string: ' aaa',
    };
    const formStateWithSpaceAfter = {
      string: 'aaa  ',
    };

    const configWithSimple: StringField<typeof formStateWithNull, 'string'> = {
      title: 'Тестовая строка',
      type: 'string',
    };

    expect(validateString('string', configWithSimple, formStateWithNull)).toBe('');
    expect(validateString('string', configWithSimple, formState)).toBe('');
    expect(validateString('string', configWithSimple, formStateWithSpaceBefore)).toBe(getRequiredFieldNoTrim(configWithSimple.title));
    expect(validateString('string', configWithSimple, formStateWithSpaceAfter)).toBe(getRequiredFieldNoTrim(configWithSimple.title));
  });

  test('Проверка на строку', () => {
    const formStateWithNull = {
      string: null,
    };
    const formState = {
      string: 'aaa',
    };
    const formStateWithNumber= {
      string: 2,
    };

    const configWithSimple: StringField<typeof formStateWithNull, 'string'> = {
      title: 'Тестовая строка',
      type: 'string',
    };

    expect(validateString('string', configWithSimple, formStateWithNull)).toBe('');
    expect(validateString('string', configWithSimple, formState)).toBe('');
    expect(validateString('string', configWithSimple, formStateWithNumber)).toBe(getRequiredFieldStringMessage(configWithSimple.title));
  });
});
