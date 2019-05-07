import * as React from 'react';
import useAutobaseEngineTypeList from '../useList/useAutobaseEngineTypeList';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

const useAutobaseEngineTypeOptions = (page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const list = useAutobaseEngineTypeList(page, path);

  const countryOptions = React.useMemo(
    () => {
      return list.map(defaultSelectListMapper);
    },
    [list],
  );

  return countryOptions;
};

export default useAutobaseEngineTypeOptions;
