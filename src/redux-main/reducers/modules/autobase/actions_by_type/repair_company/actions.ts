import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRepairCompany,
  createSetRepairCompany,
  updateSetRepairCompany,
  autobaseDeleteRepairCompany,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- RepairCompany ---------- */
export const autobaseSetRepairCompany = (repairCompanyList: RepairCompany[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      repairCompanyList,
    }),
  )
);
export const autobaseResetSetRepairCompany = (): EtsAction<EtsActionReturnType<typeof autobaseSetRepairCompany>> => (dispatch) => (
  dispatch(
    autobaseSetRepairCompany([]),
  )
);
export const autobaseGetSetRepairCompany = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRepairCompany>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetRepairCompany(payloadOwn),
    meta,
  );
};
export const repairCompanyGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRepairCompany>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetRepairCompany(payload, meta),
  );

  dispatch(
    autobaseSetRepairCompany(result.data),
  );

  return result;
};
export const autobaseCreateRepairCompany = (repairCompanyOld: RepairCompany, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetRepairCompany>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetRepairCompany(repairCompanyOld),
    meta,
  );
};
export const autobaseUpdateRepairCompany = (repairCompanyOld: RepairCompany, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetRepairCompany>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetRepairCompany(repairCompanyOld),
    meta,
  );
};
export const autobaseRemoveRepairCompany = (id: RepairCompany['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteRepairCompany>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteRepairCompany(id),
    meta,
  );
};
