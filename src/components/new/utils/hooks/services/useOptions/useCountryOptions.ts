import * as React from 'react';
import useCountryList from '../useList/useCountryList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { Country } from 'redux-main/reducers/modules/some_uniq/country/@types';

export const getCountryOptions = (listData: { list: Array<Country>; isLoading?: boolean; }, keyValue: string) => {
  return {
    options: listData.list.map((rowData) => ({
      value: rowData[keyValue],
      label: rowData.short_name,
      rowData,
    })),
    isLoading: listData.isLoading,
  };
};

const useCountryOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '', keyValue?: string) => {
  const listData = useCountryList(page, path);

  const countryOptions = React.useMemo(
    () => {
      return getCountryOptions(listData, keyValue ? keyValue : 'id');
    },
    [listData],
  );

  return countryOptions;
};

export default useCountryOptions;
