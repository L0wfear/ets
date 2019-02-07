export const makeDataListAfterLoadInitialData = <T extends any>({ array }: { array: T[] }) => {
  const total_count = array.length;

  return {
    total_count,
    array,
  };
};
