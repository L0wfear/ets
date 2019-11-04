import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetTire,
  createSetTire,
  cloneSetTire,
  updateSetTire,
  autobaseDeleteTire,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- Tire ---------- */
export const autobaseSetTire = (tireList: Tire[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireList,
    }),
  )
);
export const autobaseResetSetTire = (): EtsAction<EtsActionReturnType<typeof autobaseSetTire>> => (dispatch) => (
  dispatch(
    autobaseSetTire([]),
  )
);
export const autobaseGetSetTire = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetTire>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetTire(payloadOwn),
    meta,
  );
};
export const tireGetAndSetInStore = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetTire>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetTire(payloadOwn, meta),
  );

  dispatch(
    autobaseSetTire(result.data),
  );

  return result;
};
export const autobaseCreateTire = (tireOld: Tire, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetTire>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetTire(tireOld),
    meta,
  );
};
export const autobaseCloneTire = (tireId: Tire['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof cloneSetTire>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    cloneSetTire(tireId),
    meta,
  );
};
export const autobaseUpdateTire = (tireOld: Tire, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetTire>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetTire(tireOld),
    meta,
  );
};
export const autobaseRemoveTire = (id: Tire['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteTire>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteTire(id),
    meta,
  );
};
