import { MeasureUnitApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useMeasureUnitList = (payload: object, page: string, path: string) => {
  return useLoadListData<MeasureUnitApi>('measure_unit', '', payload, page, path);
};

export default useMeasureUnitList;
