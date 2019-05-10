import { TimeApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useMoscowTime = (page: string, path?: string) => {
  return useLoadListData<TimeApi>('time', null, page, path);
};

export default useMoscowTime;
