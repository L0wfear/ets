import { CountryApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useCountryList = (page: string, path: string) => {
  return useLoadListData<CountryApi>('country', null, page, path);
};

export default useCountryList;
