import * as React from 'react';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import useCarTypesList from '../useList/useCarTypesList';

const useCarTypesOptions = (page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const list = useCarTypesList(page, path);

  const typesOptions = React.useMemo(
    () => {
      return list.map((rowData) => ({
        value: rowData.asuods_id,
        label: rowData.short_name,
        rowData,
      }));
    },
    [list],
  );

  return typesOptions;
};

export default useCarTypesOptions;
