import { CountryApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './useLoadListData';

const useCountryList = (page: string, path: string): CountryApi['result'] => {
  return useLoadListData<CountryApi>('country', page, path);
};

export default useCountryList;
