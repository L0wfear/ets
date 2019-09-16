import { get } from 'lodash';
import { MeasureUnitApi } from 'components/new/utils/context/loading/@types/all';
import useLoadListData from './common/useLoadListData';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const useMeasureUnitList = (payload: object, meta: LoadingMeta) => {
  return useLoadListData<MeasureUnitApi>('measure_unit', '', payload, get(meta, 'page', ''), get(meta, 'path', ''));
};

export default useMeasureUnitList;
