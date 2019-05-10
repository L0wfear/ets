import * as React from 'react';
import LoadingContext from 'components/new/utils/context/loading/LoadingContext';
import { LoadingServiceGeneric } from 'components/new/utils/context/loading/@types/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { isArray } from 'util';

const useLoadListData = <ApiConfig extends LoadingServiceGeneric<any, any, any>>(apiUrl: ApiConfig['url'], payload: ApiConfig['payload'], page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const [list, setList] = React.useState<ApiConfig['result']>([]);
  const context = React.useContext(LoadingContext);

  React.useEffect(
    () => {
      context.loadService(apiUrl).get<ApiConfig>(payload || {}, { page, path }).then(
        (listData) => (
          setList(isArray(listData) ? listData : [listData])
        ),
      ).catch((error) => {
        console.error(error); //tslint:disable-line
      });
    },
    [],
  );

  return list;
};

export default useLoadListData;
