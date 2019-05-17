
import { EmployeeApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useEmployeeList = (page: string, path: string) => {
  return useLoadListData<EmployeeApi>('employee', {}, page, path);
};

export default useEmployeeList;
