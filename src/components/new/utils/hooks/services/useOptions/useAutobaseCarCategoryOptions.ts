import * as React from 'react';
import useAutobaseCarCategoryList from '../useList/useAutobaseCarCategoryList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useAutobaseCarCategoryOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useAutobaseCarCategoryList(page, path);

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

export default useAutobaseCarCategoryOptions;
