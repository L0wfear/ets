import { get } from 'lodash';

import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { RootService } from 'api/Services';

type DefaultAns<F> = {
  data: F;
  response: any;
};

export const defaultAction = <F extends any>(promise: Promise<F>, meta: LoadingMeta): EtsAction<Promise<F>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promise,
    meta,
  )
);

export const defaultActions = <F extends any>(path: string, setStoreAction: (obj: { data: Array<F>; response: any; }) => any, mapFunction: (data: F, index?: number, array?: Array<F>) => F = (d) => d) => {
  return {
    getOne: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows'): EtsAction<Promise<DefaultAns<F>>> => (dispatch) => (
      dispatch(
        defaultAction<DefaultAns<F>>(
          RootService.path(path).get(payload)
            .then((response) => {
              const data = mapFunction(get(response, `${typeAns}.0`));

              return {
                data,
                response,
              };
            }),
          meta,
        ),
      )
    ),
    // работает
    getArray: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows'): EtsAction<Promise<DefaultAns<Array<F>>>> => (dispatch) => (
      dispatch(
        defaultAction<DefaultAns<Array<F>>>(
          RootService.path(path).get(payload)
            .then((response) => {
              const data = (get(response, typeAns) as Array<Partial<F>>).map(mapFunction);

              return {
                data,
                response,
              };
            }),
          meta,
        ),
      )
    ),
    getArrayAndSetInStore: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows'): EtsAction<Promise<DefaultAns<F>>> => (dispatch) => (
      dispatch(
        defaultAction<DefaultAns<F>>(
          RootService.path(path).get(payload)
            .then((response) => {
              const data = (get(response, typeAns) as Array<Partial<F>>).map(mapFunction);
              const result = {
                data,
                response,
              };

              dispatch(
                setStoreAction(result),
              );
              return result;
            }),
          meta,
        ),
      )
    ),
    post: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows'): EtsAction<Promise<DefaultAns<F>>> => (dispatch) => (
      dispatch(
        defaultAction<DefaultAns<F>>(
          RootService.path(path).post(payload)
            .then((response) => {
              const data = mapFunction(get(response, `${typeAns}.0`));

              return {
                data,
                response,
              };
            }),
          meta,
        ),
      )
    ),
    put: <Payload extends any>(payload: Payload, meta: LoadingMeta, typeAns: 'result' | 'result.rows' = 'result.rows'): EtsAction<Promise<DefaultAns<F>>> => (dispatch) => (
      dispatch(
        defaultAction<DefaultAns<F>>(
          RootService.path(path).put(payload)
            .then((response) => {
              const data = mapFunction(get(response, `${typeAns}.0`));

              return {
                data,
                response,
              };
            }),
          meta,
        ),
      )
    ),
    remove: <Payload extends any>(payload: Payload, meta: LoadingMeta): EtsAction<Promise<DefaultAns<F>>> => (dispatch) => (
      dispatch(
        defaultAction<DefaultAns<F>>(
          RootService.path(path).delete(payload),
          meta,
        ),
      )
    ),
    // работает
    blob: <Payload extends any>(payload: Payload, meta: LoadingMeta): EtsAction<Promise<{ blob: any; fileName: any; }>> => (dispatch) => (
      dispatch(
        defaultAction<{ blob: any; fileName: any; }>(
          RootService.path(path).getBlob(payload),
          meta,
        ),
      )
    ),
  };
};
