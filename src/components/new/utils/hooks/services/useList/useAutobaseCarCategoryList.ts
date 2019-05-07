import { AutobaseCarCategoryApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './useLoadListData';

const useAutobaseCarCategoryList = (page: string, path: string): AutobaseCarCategoryApi['result'] => {
  return useLoadListData<AutobaseCarCategoryApi>('autobase/car_category', page, path);
};

export default useAutobaseCarCategoryList;
