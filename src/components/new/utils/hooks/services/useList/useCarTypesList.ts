import { TypesApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useCarTypesList = (page: string, path: string) => {
  return useLoadListData<TypesApi>('types', [], null, page, path);
};

export default useCarTypesList;
