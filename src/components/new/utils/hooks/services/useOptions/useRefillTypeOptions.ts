import * as React from 'react';
import { keyBy } from 'lodash';

import useRefillTypeList from '../useList/useRefillTypeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useRefillTypeOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useRefillTypeList(page, path);

  const optionData = React.useMemo(
    () => {
      const options = listData.list.map((rowData) => ({
        value: rowData.id,
        label: rowData.name,
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

export default useRefillTypeOptions;
