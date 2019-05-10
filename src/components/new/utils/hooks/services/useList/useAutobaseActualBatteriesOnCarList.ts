import { AutobaseActualBatteriesOnCarApi } from 'components/new/utils/context/loading/@types/all';

import useLoadListDataByCarId from './common/useLoadListDataByCarId';

const useAutobaseActualBatteriesOnCarList = (car_id, page: string, path: string) => {
  return useLoadListDataByCarId<AutobaseActualBatteriesOnCarApi>('autobase/actual_batteries_on_car', car_id, page, path);
};

export default useAutobaseActualBatteriesOnCarList;
