import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetTechMaintOrder,
  createSetTechMaintOrder,
  updateSetTechMaintOrder,
  autobaseDeleteTechMaintOrder,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_order/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- TechMaintOrder ---------- */
export const autobaseSetTechMaintOrder = (techMaintOrderList: Array<TechMaintOrder>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techMaintOrderList,
    }),
  )
);
export const autobaseResetSetTechMaintOrder = (): EtsAction<EtsActionReturnType<typeof autobaseSetTechMaintOrder>> => (dispatch) => (
  dispatch(
    autobaseSetTechMaintOrder([]),
  )
);
export const autobaseGetSetTechMaintOrder = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetTechMaintOrder>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetTechMaintOrder(payloadOwn),
    meta,
  );
};
export const techMaintOrderGetAndSetInStore = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetTechMaintOrder>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetTechMaintOrder(payloadOwn, meta),
  );

  dispatch(
    autobaseSetTechMaintOrder(result.data),
  );

  return result;
};
export const autobaseCreateTechMaintOrder = (techMaintOrderOld: TechMaintOrder, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetTechMaintOrder>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetTechMaintOrder(techMaintOrderOld),
    meta,
  );
};
export const autobaseUpdateTechMaintOrder = (techMaintOrderOld: TechMaintOrder, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetTechMaintOrder>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetTechMaintOrder(techMaintOrderOld),
    meta,
  );
};
export const autobaseRemoveTechMaintOrder = (id: TechMaintOrder['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteTechMaintOrder>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteTechMaintOrder(id),
    meta,
  );
};
