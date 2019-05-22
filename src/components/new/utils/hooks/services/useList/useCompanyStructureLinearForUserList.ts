import { CompanyStructureLinearForUserListApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useCompanyStructureLinearForUserList = (page: string, path: string) => {
  return useLoadListData<CompanyStructureLinearForUserListApi>('company_structure', { descendants_by_user: true, linear: 1 }, page, path);
};

export default useCompanyStructureLinearForUserList;
