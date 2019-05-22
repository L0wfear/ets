import * as React from 'react';
import useCompanyStructureLinearForUserList from '../useList/useCompanyStructureLinearForUserList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useCompanyStructureLinearForUserOptions = (page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useCompanyStructureLinearForUserList(page, path);

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

export default useCompanyStructureLinearForUserOptions;
