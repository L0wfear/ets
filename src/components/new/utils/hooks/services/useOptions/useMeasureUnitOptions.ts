import useMeasureUnitList from '../useList/useMeasureUnitList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import useDefaultOptons from './common/useDefaultOptons';

const useMeasureUnitOptions = (page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const list = useMeasureUnitList(page, path);

  const options = useDefaultOptons(list);

  return options;
};

export default useMeasureUnitOptions;
