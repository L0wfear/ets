import useAutobaseEngineTypeList from '../useList/useAutobaseEngineTypeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import useDefaultOptons from './common/useDefaultOptons';

const useAutobaseEngineTypeOptions = (page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const list = useAutobaseEngineTypeList(page, path);

  const options = useDefaultOptons(list);

  return options;
};

export default useAutobaseEngineTypeOptions;
