import { AutobaseCarCategoryApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useAutobaseCarCategoryList = (page: string, path: string) => {
  return useLoadListData<AutobaseCarCategoryApi>('autobase/car_category', page, path);
};

export default useAutobaseCarCategoryList;
