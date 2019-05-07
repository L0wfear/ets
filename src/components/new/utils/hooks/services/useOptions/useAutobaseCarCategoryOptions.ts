import useAutobaseCarCategoryList from '../useList/useAutobaseCarCategoryList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import useDefaultOptons from './common/useDefaultOptons';

const useAutobaseCarCategoryOptions = (page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const list = useAutobaseCarCategoryList(page, path);

  const options = useDefaultOptons(list);

  return options;
};

export default useAutobaseCarCategoryOptions;
