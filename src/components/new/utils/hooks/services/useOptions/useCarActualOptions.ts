import * as React from 'react';
import useCarActualList from '../useList/useCarActualList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { isFunction } from 'util';

const useCarActualOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '', hookPayload?: { labelFunc; }) => {
  const listData = useCarActualList(page, path);

  const carActualOptions = React.useMemo(
    () => {
      return {
        options: listData.list.map((rowData) => ({
          value: rowData.asuods_id,
          label: isFunction(hookPayload && hookPayload.labelFunc)
            ? hookPayload.labelFunc(rowData)
            : rowData.gov_number,
          rowData,
        })),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );

  return carActualOptions;
};

export default useCarActualOptions;
