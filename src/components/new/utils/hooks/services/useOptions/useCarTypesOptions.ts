import * as React from 'react';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import useCarTypesList from '../useList/useCarTypesList';

const useCarTypesOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useCarTypesList(page, path);

  const optionData = React.useMemo(
    () => {
      return {
        options: listData.list.map((rowData) => ({
          value: rowData.asuods_id,
          label: rowData.short_name,
          rowData,
        })),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );

  return optionData;
};

export default useCarTypesOptions;
