import * as React from 'react';
import useWorkModeList from '../useList/useWorkModeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useWorkModeOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useWorkModeList(page, path);

  const optionsData = React.useMemo(
    () => {
      return {
        options: listData.list.map((rowData) => ({
          value: rowData.id,
          label: `${rowData.name} (${rowData.start_time_text} - ${rowData.end_time_text})`,
          rowData,
        })),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );

  return optionsData;
};

export default useWorkModeOptions;
