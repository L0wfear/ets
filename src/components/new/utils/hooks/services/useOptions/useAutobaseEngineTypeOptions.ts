import * as React from 'react';
import useAutobaseEngineTypeList from '../useList/useAutobaseEngineTypeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useAutobaseEngineTypeOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useAutobaseEngineTypeList(page, path);

  const optionData = React.useMemo(
    () => {
      return {
        options: listData.list.map((rowData) => ({
          value: rowData.id,
          label: rowData.name,
          rowData,
        })),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );
  return optionData;
};

export default useAutobaseEngineTypeOptions;
