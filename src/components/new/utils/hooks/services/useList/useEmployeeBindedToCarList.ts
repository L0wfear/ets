import * as React from 'react';
import { EmployeeBindedToCarApi } from 'components/new/utils/context/loading/@types/all';
import { ListData } from './common/useLoadListData';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import LoadingContext from 'components/new/utils/context/loading/LoadingContext';

const useEmployeeBindedToCarApiList = (car_id: Car['asuods_id'], page: string = '', path: string = '') => {
  const [list, setList] = React.useState<ListData<EmployeeBindedToCarApi>>({ list: [], isLoading: true });
  const context = React.useContext(LoadingContext);

  React.useEffect(
    () => {
      let timeId = null;
      const loadData = async () => {
        if (car_id) {
          timeId = setTimeout(
            () => setList((oldList) => ({ ...oldList, isLoading: true })),
            300,
          );
          try {
            setList({
              list: [],
              isLoading: true,
            });
            const listData = await context.loadService('employee_binded_to_car').path(car_id).get<EmployeeBindedToCarApi>({}, { page, path });
            clearTimeout(timeId);
            setList({
              list: listData,
              isLoading: false,
            });
          } catch (error) {
            console.error(error);
          }
        } else {
          setList({
            list: [],
            isLoading: false,
          });
        }
      };
      loadData();

      return () => {
        clearTimeout(timeId);
      };
    },
    [car_id],
  );

  return list;
};

export default useEmployeeBindedToCarApiList;
