import * as React from 'react';
import useStructureLinearList from '../useList/useStructureLinearList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useStructureOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useStructureLinearList(page, path);

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

export default useStructureOptions;
