import * as React from 'react';
import { MedicalStatsAllowedDriverApi } from 'components/new/utils/context/loading/@types/all';
import { ListData } from './common/useLoadListData';
import LoadingContext from 'components/new/utils/context/loading/LoadingContext';

const useMedicalStatsAllowedDriverList = (company_id: number, date_from: string, date_to: string, page: string = '', path: string = '') => {
  const [list, setList] = React.useState<ListData<MedicalStatsAllowedDriverApi>>({ list: [], isLoading: true });
  const context = React.useContext(LoadingContext);

  React.useEffect(
    () => {
      const loadData = async () => {
        if (company_id && date_from && date_to) {
          try {
            setList({
              list: [],
              isLoading: true,
            });
            const listData = await context.loadService('medical_stats/allowed_drivers').get<MedicalStatsAllowedDriverApi>(
              {
                company_id,
                date_from,
                date_to,
                type: 'before',
              },
              { page, path },
            );
            setList({
              list: listData,
              isLoading: false,
            });
          } catch (error) {
            console.error(error); //tslint:disable-line
          }
        } else {
          setList({
            list: [],
            isLoading: false,
          });
        }
      };
      loadData();
    },
    [company_id, date_from, date_to],
  );

  return list;
};

export default useMedicalStatsAllowedDriverList;
