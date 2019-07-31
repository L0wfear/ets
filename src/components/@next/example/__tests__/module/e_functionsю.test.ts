import {
  exampleFunc1,
  exampleFunc2,
  exampleFunc3,
} from 'components/@next/example/module/e_functions';

describe('Проверка функций из примера', () => {
  test('Проверка exampleFunc1 на корректность суммы', () => {
    const a = 1;
    const b = 2;

    expect(exampleFunc1(a, b)).toBe(a + b);
    expect(exampleFunc1(a, b)).not.toBe(-1);
    expect(exampleFunc1(NaN, b)).toBeNaN();
  });

  test('Проверка exampleFunc2 на ошибку суммы', () => {
    const a = 10;
    const b = 20;
    expect(exampleFunc2(a, b)).not.toBe(3);
  });

  test('Проверка асинхронной функции exampleFunc3 на корректность суммы', async () => {
    const a = 1;
    const b = 2;
    try {
      const result = await exampleFunc3(a, b);
      expect(result).toBe(a + b);
    } catch (error) {
      expect(error).toThrow(Error);
    }
  });
});
