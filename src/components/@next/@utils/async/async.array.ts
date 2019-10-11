export const async_map = <T extends any, U extends any>(
  array: Array<T>,
  callback: (value: T, index: number, array: Array<T>) => U,
) => {
  return Promise.all(
    array.map(
      (...arg) => {
        return new Promise<U>(
          (resolve) => {
            setImmediate(() => resolve(callback(...arg)));
          },
        );
      },
    ),
  );
};
