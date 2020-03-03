import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetTechInspection,
  createSetTechInspection,
  updateSetTechInspection,
  autobaseDeleteTechInspection,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_inspection/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- TechInspection ---------- */
export const autobaseSetTechInspection = (techInspectionList: Array<TechInspection>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techInspectionList,
    }),
  )
);
export const autobaseResetSetTechInspection = (): EtsAction<EtsActionReturnType<typeof autobaseSetTechInspection>> => (dispatch) => (
  dispatch(
    autobaseSetTechInspection([]),
  )
);
export const autobaseGetSetTechInspection = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetTechInspection>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetTechInspection(payloadOwn),
    meta,
  );
};
export const techInspectionGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetTechInspection>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetTechInspection(payload, meta),
  );

  dispatch(
    autobaseSetTechInspection(result.data),
  );

  return result;
};
export const autobaseCreateTechInspection = (techInspectionOld: TechInspection, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetTechInspection>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetTechInspection(techInspectionOld),
    meta,
  );
};
export const autobaseUpdateTechInspection = (techInspectionOld: TechInspection, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetTechInspection>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetTechInspection(techInspectionOld),
    meta,
  );
};
export const autobaseRemoveTechInspection = (id: TechInspection['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteTechInspection>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteTechInspection(id),
    meta,
  );
};
