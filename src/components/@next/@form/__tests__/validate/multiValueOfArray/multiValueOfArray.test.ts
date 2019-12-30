import { validateMultiValueOfArray } from 'components/@next/@form/validate/multiValueOfArray/multiValueOfArrayValidate';
import { MultiValueOfArrayField } from 'components/@next/@form/@types';

describe('Проверка валидации формы по multiValueOfArray', () => {
  test('Проверка обязательности заполнения multiValueOfArray', () => {
    const formStateWithNull = {
      valueArr: null,
    };
    const formStateWithEmptyArr = {
      valueArr: [],
    };
    const formStateWithNotEmptyArr = {
      valueArr: [1],
    };

    const configWithSimple: MultiValueOfArrayField<typeof formStateWithNull, 'valueArr'> = {
      title: 'Тестовое значение',
      type: 'multiValueOfArray',
    };
    const configWithRequired: MultiValueOfArrayField<typeof formStateWithNull, 'valueArr'> = {
      ...configWithSimple,
      required: true,
    };

    expect(Boolean(validateMultiValueOfArray('valueArr', configWithSimple, formStateWithNull))).toBeFalsy();
    expect(Boolean(validateMultiValueOfArray('valueArr', configWithSimple, formStateWithEmptyArr))).toBeFalsy();
    expect(Boolean(validateMultiValueOfArray('valueArr', configWithSimple, formStateWithNotEmptyArr))).toBeFalsy();

    expect(Boolean(validateMultiValueOfArray('valueArr', configWithRequired, formStateWithNull))).toBeTruthy();
    expect(Boolean(validateMultiValueOfArray('valueArr', configWithRequired, formStateWithEmptyArr))).toBeTruthy();
    expect(Boolean(validateMultiValueOfArray('valueArr', configWithRequired, formStateWithNotEmptyArr))).toBeFalsy();
  });
});
