import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRepair,
  createSetRepair,
  updateSetRepair,
  autobaseDeleteRepair,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- Repair ---------- */
export const autobaseSetRepair = (repairList: Array<Repair>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      repairList,
    }),
  )
);
export const autobaseResetSetRepair = (): EtsAction<EtsActionReturnType<typeof autobaseSetRepair>> => (dispatch) => (
  dispatch(
    autobaseSetRepair([]),
  )
);
export const autobaseGetSetRepair = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRepair>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetRepair(payloadOwn),
    meta,
  );
};
export const repairGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRepair>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetRepair(payload, meta),
  );

  dispatch(
    autobaseSetRepair(result.data),
  );

  return result;
};
export const autobaseCreateRepair = (repairOld: Repair, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetRepair>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetRepair(repairOld),
    meta,
  );
};
export const autobaseUpdateRepair = (repairOld: Repair, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetRepair>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetRepair(repairOld),
    meta,
  );
};
export const autobaseRemoveRepair = (id: Repair['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteRepair>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteRepair(id),
    meta,
  );
};
