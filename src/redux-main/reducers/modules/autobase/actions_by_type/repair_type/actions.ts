import { RepairType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRepairType,
  createSetRepairType,
  updateSetRepairType,
  autobaseDeleteRepairType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair_type/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- RepairType ---------- */
export const autobaseSetRepairType = (repairTypeList: RepairType[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      repairTypeList,
    }),
  )
);
export const autobaseResetSetRepairType = (): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetRepairType([]),
  )
);
export const autobaseGetSetRepairType = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRepairType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetRepairType(payloadOwn),
    meta,
  );
};
export const repairTypeGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRepairType>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetRepairType(payload, meta),
  );

  dispatch(
    autobaseSetRepairType(result.data),
  );

  return result;
};
export const autobaseCreateRepairType = (repairTypeOld: RepairType, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetRepairType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetRepairType(repairTypeOld),
    meta,
  );
};
export const autobaseUpdateRepairType = (repairTypeOld: RepairType, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetRepairType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetRepairType(repairTypeOld),
    meta,
  );
};
export const autobaseRemoveRepairType = (id: RepairType['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteRepairType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteRepairType(id),
    meta,
  );
};
