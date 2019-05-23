import { TimeApi } from 'components/new/utils/context/loading/@types/all';
import useLoadData from './common/useLoadData';

const useMoscowTime = (page: string, path?: string) => {
  return useLoadData<TimeApi>('time', null, page, path);
};

export default useMoscowTime;
