import * as React from 'react';
import LoadingContext from 'components/new/utils/context/loading/LoadingContext';
import { LoadingServiceGeneric } from 'components/new/utils/context/loading/@types/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export type ListData<ApiConfig extends LoadingServiceGeneric<any, any, any>> = { data: ApiConfig['result']; isLoading: boolean; };

const useLoadListData = <ApiConfig extends LoadingServiceGeneric<any, any, any>>(apiUrl: ApiConfig['url'], payload: ApiConfig['payload'], page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const [list, setList] = React.useState<ListData<ApiConfig>>({ data: null, isLoading: true });
  const context = React.useContext(LoadingContext);

  React.useEffect(
    () => {
      context.loadService(apiUrl).get<ApiConfig>(payload || {}, { page, path }).then(
        (data) => (
          setList({
            data,
            isLoading: false,
          })
        ),
      ).catch((error) => {
        console.error(error);
      });
    },
    [],
  );

  return list;
};

export default useLoadListData;
