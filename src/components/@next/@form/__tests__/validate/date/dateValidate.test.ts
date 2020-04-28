import { validateDate } from 'components/@next/@form/validate/date/dateValidate';
import { DateField } from 'components/@next/@form/@types';

describe('Проверка валидации формы по date', () => {
  test('Дата должна быть позже 1900-01-01T00:00:00', () => {
    const formStateStandart = {
      date: new Date(),
    };
    const formStateWithNull = {
      date: null,
    };
    const formStateWithLittleDate = {
      date: new Date(1899, 11, 31, 23, 59, 59),
    };
    const formStateWithBorderDate = {
      date: new Date(1900, 0, 1, 0, 0, 0),
    };

    const configWithSimple: DateField<typeof formStateStandart, 'date'> = {
      title: 'Тестовая дата',
      type: 'date',
    };

    expect(Boolean(validateDate('date', configWithSimple, formStateStandart))).toBeFalsy();
    expect(Boolean(validateDate('date', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateDate('date', configWithSimple, formStateWithLittleDate))).toBeTruthy();
    expect(Boolean(validateDate('date', configWithSimple, formStateWithBorderDate))).toBeFalsy();
  });
  test('Проверка обязательности заполнения даты', () => {
    const formStateWithNull = {
      date: null,
    };
    const formStateWithDate = {
      date: new Date(),
    };

    const configWithSimple: DateField<typeof formStateWithNull, 'date'> = {
      title: 'Тестовая дата',
      type: 'date',
    };
    const configWithRequired: DateField<typeof formStateWithNull, 'date'> = {
      ...configWithSimple,
      required: true,
    };

    expect(Boolean(validateDate('date', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateDate('date', configWithSimple, formStateWithDate))).toBeFalsy();

    expect(Boolean(validateDate('date', configWithRequired, formStateWithNull))).toBeTruthy();
    expect(Boolean(validateDate('date', configWithRequired, formStateWithDate))).toBeFalsy();
  });
});
