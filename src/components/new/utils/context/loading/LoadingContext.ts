import * as React from 'react';
import { get } from 'lodash';
import { getJSON } from 'api/adapter';
import { processResponse } from 'api/APIService';
import config from 'config';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingService } from './@types';

export const loadingService = (dispatch: any): LoadingService => (url) => {
  return {
    get: async (payload = {}, meta) => {
      const result = await etsLoadingCounter(
        dispatch,
        getJSON(`${config.backend}/${url}`, payload || {}),
        meta,
      );
      processResponse(result);

      return get(
        result, 'result.rows',
        get(
          result, 'result',
          get(
            result,  '',
            null,
          ),
        ),
      );
    },
    path: (partialPath: string | number) => {
      return loadingService(dispatch)(`${url}/${partialPath}`);
    },
  };
};

export const getLoadingContextDefaultValue = (dispatch: any) => ({
  loadService: (serviceName) => {
    return loadingService(dispatch)(serviceName);
  },
});

const LoadingContext = React.createContext<ReturnType<typeof getLoadingContextDefaultValue>>(getLoadingContextDefaultValue(null));

export default LoadingContext;
