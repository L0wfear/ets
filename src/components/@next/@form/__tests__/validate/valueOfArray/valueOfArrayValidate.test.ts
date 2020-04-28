import { validateValueOfArray } from 'components/@next/@form/validate/valueOfArray/valueOfArrayValidate';
import { ValueOfArrayField } from 'components/@next/@form/@types';

describe('Проверка валидации формы по valueOfArray', () => {
  test('Проверка обязательности заполнения valueOfArray', () => {
    const formStateWithNull = {
      value: null,
    };
    const formStateWithDate = {
      value: 1,
    };

    const configWithSimple: ValueOfArrayField<typeof formStateWithNull, 'value'> = {
      title: 'Тестовая значение',
      type: 'valueOfArray',
    };
    const configWithRequired: ValueOfArrayField<typeof formStateWithNull, 'value'> = {
      ...configWithSimple,
      required: true,
    };

    expect(Boolean(validateValueOfArray('value', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateValueOfArray('value', configWithSimple, formStateWithDate))).toBeFalsy();

    expect(Boolean(validateValueOfArray('value', configWithRequired, formStateWithNull))).toBeTruthy();
    expect(Boolean(validateValueOfArray('value', configWithRequired, formStateWithDate))).toBeFalsy();
  });
});
