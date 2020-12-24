import { InspectAuditorsApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useInspectAuditorsList = (page: string, path: string) => {
  return useLoadListData<InspectAuditorsApi>('inspection/auditors', '', null, page, path);
};

export default useInspectAuditorsList;
