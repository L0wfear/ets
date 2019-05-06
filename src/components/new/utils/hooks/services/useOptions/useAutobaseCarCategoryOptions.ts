import * as React from 'react';
import useAutobaseCarCategoryList from '../useList/useAutobaseCarCategoryList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

const useAutobaseCarCategoryOptions = (page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const list = useAutobaseCarCategoryList(page, path);

  const countryOptions = React.useMemo(
    () => {
      return list.map(defaultSelectListMapper);
    },
    [list],
  );

  return countryOptions;
};

export default useAutobaseCarCategoryOptions;
