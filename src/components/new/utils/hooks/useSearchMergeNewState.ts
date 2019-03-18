export const useSearchMergeNewState = (searchState, data) => {
  const query = {
    ...searchState,
    ...data,
  };

  Object.keys(query).forEach((key) => {
    if (!query[key]) {
      delete query[key];
    }
  });

  return query;
};
