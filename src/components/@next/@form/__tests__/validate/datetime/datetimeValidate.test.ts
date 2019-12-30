import { validateDatetime } from 'components/@next/@form/validate/datetime/datetimeValidate';
import { DateTimeField } from 'components/@next/@form/@types';

describe('Проверка валидации формы по datetime', () => {
  test('Дата должна быть позже 1900-01-01T00:00:00', () => {
    const formStateStandart = {
      datetime: new Date(),
    };
    const formStateWithNull = {
      datetime: null,
    };
    const formStateWithLittleDate = {
      datetime: new Date(1899, 11, 31, 23, 59, 59),
    };
    const formStateWithBorderDate = {
      datetime: new Date(1900, 0, 1, 0, 0, 0),
    };

    const configWithSimple: DateTimeField<typeof formStateStandart, 'datetime'> = {
      title: 'Тестовая дата',
      type: 'datetime',
    };

    expect(Boolean(validateDatetime('datetime', configWithSimple, formStateStandart))).toBeFalsy();
    expect(Boolean(validateDatetime('datetime', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateDatetime('datetime', configWithSimple, formStateWithLittleDate))).toBeTruthy();
    expect(Boolean(validateDatetime('datetime', configWithSimple, formStateWithBorderDate))).toBeFalsy();
  });
  test('Проверка обязательности заполнения даты', () => {
    const formStateWithNull = {
      datetime: null,
    };
    const formStateWithDate = {
      datetime: new Date(),
    };

    const configWithSimple: DateTimeField<typeof formStateWithNull, 'datetime'> = {
      title: 'Тестовая датавремя',
      type: 'datetime',
    };
    const configWithRequired: DateTimeField<typeof formStateWithNull, 'datetime'> = {
      ...configWithSimple,
      required: true,
    };

    expect(Boolean(validateDatetime('datetime', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateDatetime('datetime', configWithSimple, formStateWithDate))).toBeFalsy();

    expect(Boolean(validateDatetime('datetime', configWithRequired, formStateWithNull))).toBeTruthy();
    expect(Boolean(validateDatetime('datetime', configWithRequired, formStateWithDate))).toBeFalsy();
  });
});
