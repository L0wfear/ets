import { validateBoolean } from 'components/@next/@form/validate/boolean/booleanValidate';
import { BooleanField } from 'components/@next/@form/@types';

describe('Проверка валидации формы по boolean', () => {
  test('Проверка обязательности заполнения boolean', () => {
    const formStateWithNull = {
      boolean: null,
    };
    const formStateWithDate = {
      boolean: true,
    };

    const configWithSimple: BooleanField<typeof formStateWithNull, 'boolean'> = {
      title: 'Тестовая булина',
      type: 'boolean',
    };
    const configWithRequired: BooleanField<typeof formStateWithNull, 'boolean'> = {
      ...configWithSimple,
      required: true,
    };

    expect(Boolean(validateBoolean('boolean', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateBoolean('boolean', configWithSimple, formStateWithDate))).toBeFalsy();

    expect(Boolean(validateBoolean('boolean', configWithRequired, formStateWithNull))).toBeTruthy();
    expect(Boolean(validateBoolean('boolean', configWithRequired, formStateWithDate))).toBeFalsy();
  });
});
