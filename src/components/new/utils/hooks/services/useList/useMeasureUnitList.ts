import { MeasureUnitApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';

const useMeasureUnitList = (page: string, path: string) => {
  return useLoadListData<MeasureUnitApi>('measure_unit', [], null, page, path);
};

export default useMeasureUnitList;
