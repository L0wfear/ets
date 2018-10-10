
export const makeDataListAfterLoadInitialData = ({ array }) => {
  const total_count = array.length;

  return {
    total_count,
    array,
  };
};
