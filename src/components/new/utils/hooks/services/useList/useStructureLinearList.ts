import { CompanyStructureLinearApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useStructureLinearList = (page: string, path: string) => {
  return useLoadListData<CompanyStructureLinearApi>('company_structure', [], { linear: true }, page, path);
};

export default useStructureLinearList;
