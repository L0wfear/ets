import * as React from 'react';
import useInspectAuditorsList from '../useList/useInspectAuditorsList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useInspectAuditorsOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useInspectAuditorsList(page, path);

  const countryOptions = React.useMemo(
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

  return countryOptions;
};

export default useInspectAuditorsOptions;
