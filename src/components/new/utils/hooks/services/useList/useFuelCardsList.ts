
import { FuelCardsApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useFuelCardsList = (page: string = '', path: string = '') => {
  return useLoadListData<FuelCardsApi>('fuel_cards', '', null, page, path);
};

export default useFuelCardsList;
