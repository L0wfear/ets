import { TechMaintenance } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TechMaintenanceExtra } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  getSetTechMaint,
  createSetTechMaint,
  updateSetTechMaint,
  autobaseDeleteTechMaint,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint/promise';
import { autobaseInitialState } from 'redux-main/reducers/modules/autobase/autobase';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- TechMaintenance ---------- */
export const autobaseSetTechMaintenance = (techMaintList: TechMaintenance[], techMaintExtra: TechMaintenanceExtra): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techMaintList,
      techMaintExtra,
    }),
  )
);
export const autobaseResetSetTechMaintenance = (): EtsAction<EtsActionReturnType<typeof autobaseSetTechMaintenance>> => (dispatch) => (
  dispatch(
    autobaseSetTechMaintenance(
      autobaseInitialState.techMaintList,
      autobaseInitialState.techMaintExtra,
    ),
  )
);
export const autobaseGetSetTechMaintenance = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetTechMaint>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetTechMaint(payloadOwn),
    meta,
  );
};
export const techMaintGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetTechMaint>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetTechMaintenance(payload, meta),
  );

  dispatch(
    autobaseSetTechMaintenance(result.data, result.extraData),
  );

  return result;
};
export const autobaseCreateTechMaintenance = (techMaintOld: TechMaintenance, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetTechMaint>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetTechMaint(techMaintOld),
    meta,
  );
};
export const autobaseUpdateTechMaintenance = (techMaintOld: TechMaintenance, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetTechMaint>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetTechMaint(techMaintOld),
    meta,
  );
};
export const autobaseRemoveTechMaintenance = (id: TechMaintenance['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteTechMaint>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteTechMaint(id),
    meta,
  );
};
