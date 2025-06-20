import { AutobaseActualTiresOnCarApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListDataByCarId from './common/useLoadListDataByCarId';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const useAutobaseActualTiresOnCarList = (car_id: Car['asuods_id'], page: string, path: string) => {
  return useLoadListDataByCarId<AutobaseActualTiresOnCarApi>('autobase/actual_tires_on_car', car_id, page, path);
};

export default useAutobaseActualTiresOnCarList;
