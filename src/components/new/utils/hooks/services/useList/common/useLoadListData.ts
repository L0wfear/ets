import * as React from 'react';
import LoadingContext from 'components/new/utils/context/loading/LoadingContext';
import { LoadingServiceGeneric } from 'components/new/utils/context/loading/@types/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { isArray, isString } from 'util';

export type ListData<ApiConfig extends LoadingServiceGeneric<any, any, any>> = { list: ApiConfig['result']; isLoading: boolean; };

const useLoadListData = <ApiConfig extends LoadingServiceGeneric<any, any, any>>(apiUrl: ApiConfig['url'], partialPath: string | Array<string | number>, payload: ApiConfig['payload'], page: LoadingMeta['page'], path: LoadingMeta['path']) => {
  const [list, setList] = React.useState<ListData<ApiConfig>>({ list: [], isLoading: true });
  const context = React.useContext(LoadingContext);

  React.useEffect(
    () => {
      let timeId = null;
      const loadData = async () => {
        timeId = setTimeout(
          () => setList((oldList) => ({ ...oldList, isLoading: true })),
          300,
        );
        let service = context.loadService(apiUrl);
        if (partialPath) {
          if (isArray(partialPath)) {
            partialPath.forEach(
              (addPath) => {
                service = service.path(addPath);
              },
            );
          }
          if (isString(partialPath) && partialPath) {
            service = service.path(partialPath);
          }
        }

        try {
          const listData = await service.get<ApiConfig>(payload || {}, { page, path });
          clearTimeout(timeId);
          setList({
            list: isArray(listData) ? listData : [listData],
            isLoading: false,
          });
        } catch (error) {
          console.error(error); //tslint:disable-line
        }
      };

      loadData();

      return () => {
        clearTimeout(timeId);
      };
    },
    [partialPath, payload],
  );

  return list;
};

export default useLoadListData;
