import { WorkModeApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useWorkModeList = (page: string, path: string) => {
  return useLoadListData<WorkModeApi>('work_mode', '', null, page, path);
};

export default useWorkModeList;
