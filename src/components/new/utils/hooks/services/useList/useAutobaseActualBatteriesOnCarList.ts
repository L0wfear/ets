import { AutobaseActualBatteriesOnCarApi } from 'components/new/utils/context/loading/@types/all';

import useLoadListDataByCarId from './common/useLoadListDataByCarId';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const useAutobaseActualBatteriesOnCarList = (car_id: Car['asuods_id'], page: string, path: string) => {
  return useLoadListDataByCarId<AutobaseActualBatteriesOnCarApi>('autobase/actual_batteries_on_car', car_id, page, path);
};

export default useAutobaseActualBatteriesOnCarList;
