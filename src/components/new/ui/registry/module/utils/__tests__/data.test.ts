import { makeDataListAfterLoadInitialData } from '../data';

describe('makeDataListAfterLoadInitialData', () => {
  test('get total_count from empty array', () => {
    // there will be no TS error here, and you'll have completion in modern IDEs
    const array = [];
    // same here
    expect(makeDataListAfterLoadInitialData({ array }).total_count).toEqual(0);
    expect(makeDataListAfterLoadInitialData({ array }).array).toBe(array);
  });

  test('get total_count from not empty array', () => {
    // there will be no TS error here, and you'll have completion in modern IDEs
    const array = ['array'];
    // same here
    expect(makeDataListAfterLoadInitialData({ array }).total_count).toEqual(1);
    expect(makeDataListAfterLoadInitialData({ array }).array).toBe(array);
  });
});
