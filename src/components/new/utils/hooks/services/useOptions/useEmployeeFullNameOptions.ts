import * as React from 'react';
import { keyBy } from 'lodash';

import useEmployeeList from '../useList/useEmployeeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useEmployeeFullNameOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useEmployeeList(page, path);

  const optionData = React.useMemo(
    () => {
      const options = listData.list.map((rowData) => ({
        value: rowData.id,
        label: rowData.full_name,
        rowData,
      }));
      return {
        listIndex: keyBy(listData.list, 'id'),
        options,
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );
  return optionData;
};

export default useEmployeeFullNameOptions;
