import { isNullOrUndefined } from "util";

export const useSearchMergeNewState = (searchState, data) => {
  const query = {
    ...searchState,
    ...data,
  };

  Object.keys(query).forEach((key) => {
    if (isNullOrUndefined(query[key])) {
      delete query[key];
    }
  });

  return query;
};
