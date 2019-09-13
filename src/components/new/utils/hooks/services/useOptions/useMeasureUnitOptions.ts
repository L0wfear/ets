import * as React from 'react';
import useMeasureUnitList from '../useList/useMeasureUnitList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useMeasureUnitOptions = (payload: object = {}, page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useMeasureUnitList(payload, page, path);

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

export default useMeasureUnitOptions;
