
import { RefillTypeApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useRefillTypeList = (page: string = '', path: string = '') => {
  return useLoadListData<RefillTypeApi>('refill_type', '', null, page, path);
};

export default useRefillTypeList;
