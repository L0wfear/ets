import * as React from 'react';
import useEmployeeList from '../useList/useEmployeeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useEmployeeFullNameOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useEmployeeList(page, path);

  const optionData = React.useMemo(
    () => {
      return {
        options: listData.list.map((rowData) => ({
          value: rowData.id,
          label: rowData.full_name,
          rowData,
        })),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );
  return optionData;
};

export default useEmployeeFullNameOptions;
