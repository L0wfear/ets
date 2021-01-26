import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

import { promiseLoadOrderList, promiseLoadOrderById, promiseLoadOrderHistory, promiseGetMissionTemplatesCars } from './order_promise';
import { Order } from 'redux-main/reducers/modules/order/@types';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/**
 * @todo переписать
 */
export const actionLoadOrderList = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseLoadOrderList>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseLoadOrderList(payload),
    meta,
  );

  return result;
};

export const actionLoadOrderById = (id: number, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseLoadOrderById>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseLoadOrderById(id),
    meta,
  );

  return result;
};

export const actionLoadOrderHistory = (id: Order['id'], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseLoadOrderHistory>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseLoadOrderHistory(id),
    meta,
  )
);
export const actionGetMissionTemplatesCars = (payload: Parameters<typeof promiseGetMissionTemplatesCars>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetMissionTemplatesCars>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetMissionTemplatesCars(payload),
    meta,
  )
);
