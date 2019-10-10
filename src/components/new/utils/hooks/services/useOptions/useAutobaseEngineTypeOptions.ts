import * as React from 'react';
import useAutobaseEngineTypeList from '../useList/useAutobaseEngineTypeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EngineType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getAutobaseEngineTypeOptions = (listData: { list: EngineType[], isLoading?: boolean }, keyValue: string) => {
  return {
    options: listData.list.map((rowData) => ({
      value: rowData[keyValue],
      label: rowData.name,
      rowData,
    })),
    isLoading: listData.isLoading,
  };
};

const useAutobaseEngineTypeOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '', keyValue?: string ) => {
  const listData = useAutobaseEngineTypeList(page, path);

  const optionData = React.useMemo(
    () => getAutobaseEngineTypeOptions(listData, keyValue ? keyValue : 'id'),
    [listData],
  );
  return optionData;
};

export default useAutobaseEngineTypeOptions;
