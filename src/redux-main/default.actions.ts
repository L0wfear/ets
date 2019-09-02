import { get } from 'lodash';

import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { RootService } from 'api/Services';

export const defaultAction = <F extends any>(promise: Promise<F>, meta: LoadingMeta): EtsAction<Promise<F>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promise,
    meta,
  )
);

export const defaultActions = <F extends any>(path: string, mapFunction: (data: F, index?: number, array?: Array<F>) => F = (d) => d) => {
  return {
    getOne: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows') => (
      defaultAction<{ data: F; respose: any; }>(
        RootService.path(path).get(payload)
          .then((response) => {
            const data = mapFunction(get(response, `${typeAns}.0`));

            return {
              data,
              response,
            };
          }),
        meta,
      )
    ),
    // работает
    getArray: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows') => (
      defaultAction<{ data: Array<F>; respose: any; }>(
        RootService.path(path).get(payload)
          .then((response) => {
            const data = (get(response, typeAns) as Array<Partial<F>>).map(mapFunction);

            return {
              data,
              response,
            };
          }),
        meta,
      )
    ),
    post: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows') => (
      defaultAction<{ data: F; respose: any; }>(
        RootService.path(path).post(payload)
          .then((response) => {
            const data = mapFunction(get(response, `${typeAns}.0`));

            return {
              data,
              response,
            };
          }),
        meta,
      )
    ),
    put: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows') => (
      defaultAction<{ data: F; respose: any; }>(
        RootService.path(path).put(payload)
          .then((response) => {
            const data = mapFunction(get(response, `${typeAns}.0`));

            return {
              data,
              response,
            };
          }),
        meta,
      )
    ),
    remove: <Payload extends any>(payload: Payload, meta: LoadingMeta) => (
      defaultAction<F>(
        RootService.path(path).delete(payload),
        meta,
      )
    ),
    // работает
    blob: <Payload extends any>(payload: Payload, meta: LoadingMeta) => (
      defaultAction<F>(
        RootService.path(path).getBlob(payload),
        meta,
      )
    ),
  };
};
