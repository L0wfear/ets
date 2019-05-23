import { CarActualApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useCarActualList = (page: string = '', path: string = '') => {
  return useLoadListData<CarActualApi>('car_actual', null, page, path);
};

export default useCarActualList;
