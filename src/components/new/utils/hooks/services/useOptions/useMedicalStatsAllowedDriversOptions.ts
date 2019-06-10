import * as React from 'react';
import useMedicalStatsAllowedDriverList from '../useList/useMedicalStatsAllowedDriverList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useMedicalStatsAllowedDriversOptions = (company_id: number, date_from: string, date_to: string, page: LoadingMeta['page'] = '', path: LoadingMeta['path'] = '') => {
  const listData = useMedicalStatsAllowedDriverList(company_id, date_from, date_to, page, path);

  const medicalStatsAllowedDriversOptions = React.useMemo(
    () => {
      return {
        options: listData.list.map(
          (rowData) => ({
            value: rowData.id,
            label: rowData.first_name,
            rowData,
          }),
        ),
        isLoading: listData.isLoading,
      };
    },
    [listData],
  );

  return medicalStatsAllowedDriversOptions;
};

export default useMedicalStatsAllowedDriversOptions;
