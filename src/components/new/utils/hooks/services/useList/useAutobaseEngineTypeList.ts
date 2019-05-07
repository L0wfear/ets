import { AutobaseEngineTypeApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useAutobaseEngineTypeList = (page: string, path: string) => {
  return useLoadListData<AutobaseEngineTypeApi>('autobase/engine_type', page, path);
};

export default useAutobaseEngineTypeList;
