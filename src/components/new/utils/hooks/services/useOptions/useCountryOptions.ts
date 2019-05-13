import * as React from 'react';
import useCountryList from '../useList/useCountryList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useCountryOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useCountryList(page, path);

  const countryOptions = React.useMemo(
    () => {
      return {
        options: listData.list.map((rowData) => ({
          value: rowData.id,
          label: rowData.short_name,
          rowData,
        })),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );

  return countryOptions;
};

export default useCountryOptions;
