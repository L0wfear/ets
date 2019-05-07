import { AutobaseEngineTypeApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './useLoadListData';

const useAutobaseEngineTypeList = (page: string, path: string): AutobaseEngineTypeApi['result'] => {
  return useLoadListData<AutobaseEngineTypeApi>('autobase/engine_type', page, path);
};

export default useAutobaseEngineTypeList;
