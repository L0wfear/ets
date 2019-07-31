/* Без описания типа */
/* Предпочтителен автовывод типов */
export const exampleFunc1 = (a: number, b: number) => {
  return a + b;
};

/* C описанием типа */
type ExampleFunc2 = (
  a: number,
  b: number,
) => number;

export const exampleFunc2: ExampleFunc2 = (a, b) => {
  return a + b;
};

/* async */
export const exampleFunc3 = (a: number, b: number) => {
  return new Promise(
    (res) => {
      // https://developer.mozilla.org/ru/docs/Web/JavaScript/EventLoop
      setTimeout(
        () => {
          res(a + b);
        },
        0,
      );
    },
  );
};
