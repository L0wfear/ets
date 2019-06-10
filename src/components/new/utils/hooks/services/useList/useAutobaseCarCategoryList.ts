import { AutobaseCarCategoryApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useAutobaseCarCategoryList = (page: string, path: string) => {
  return useLoadListData<AutobaseCarCategoryApi>('autobase/car_category', [], null, page, path);
};

export default useAutobaseCarCategoryList;
