import * as React from 'react';
import useLoadListData from './useLoadListData';
import { LoadingServiceGeneric } from 'components/new/utils/context/loading/@types/common';

const useLoadListDataByCarId = <ApiConfig extends LoadingServiceGeneric<any, any, any>>(apiUrl: ApiConfig['url'], car_id, page: string, path: string) => {
  const payload = React.useMemo(
    () => {
      return {
        car_id,
      };
    },
    [car_id],
  );
  return useLoadListData<ApiConfig>(apiUrl, [], payload, page, path);
};

export default useLoadListDataByCarId;
