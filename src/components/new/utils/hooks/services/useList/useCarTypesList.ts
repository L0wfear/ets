import { TypesApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './useLoadListData';

const useCarTypesList = (page: string, path: string): TypesApi['result'] => {
  return useLoadListData<TypesApi>('types', page, path);
};

export default useCarTypesList;
