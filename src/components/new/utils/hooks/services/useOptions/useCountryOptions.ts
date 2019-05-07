import * as React from 'react';
import useCountryList from '../useList/useCountryList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useCountryOptions = (page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const list = useCountryList(page, path);

  const countryOptions = React.useMemo(
    () => {
      return list.map((rowData) => ({
        value: rowData.id,
        label: rowData.short_name,
        rowData,
      }));
    },
    [list],
  );

  return countryOptions;
};

export default useCountryOptions;
