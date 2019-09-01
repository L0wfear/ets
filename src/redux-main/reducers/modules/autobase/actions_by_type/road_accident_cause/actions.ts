import { RoadAccidentCause } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRoadAccidentCause,
  createSetRoadAccidentCause,
  updateSetRoadAccidentCause,
  autobaseDeleteRoadAccidentCause,
} from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident_cause/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- RoadAccidentCause ---------- */
export const autobaseSetRoadAccidentCause = (roadAccidentCauseList: RoadAccidentCause[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      roadAccidentCauseList,
    }),
  )
);
export const autobaseResetSetRoadAccidentCause = (): EtsAction<EtsActionReturnType<typeof autobaseSetRoadAccidentCause>> => (dispatch) => (
  dispatch(
    autobaseSetRoadAccidentCause([]),
  )
);
export const autobaseGetSetRoadAccidentCause = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRoadAccidentCause>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetRoadAccidentCause(payloadOwn),
    meta,
  );
};
export const roadAccidentCauseGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetRoadAccidentCause>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetRoadAccidentCause(payload, meta),
  );

  dispatch(
    autobaseSetRoadAccidentCause(result.data),
  );

  return result;
};
export const autobaseCreateRoadAccidentCause = (roadAccidentCauseOld: RoadAccidentCause, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetRoadAccidentCause>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetRoadAccidentCause(roadAccidentCauseOld),
    meta,
  );
};
export const autobaseUpdateRoadAccidentCause = (roadAccidentCauseOld: RoadAccidentCause, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetRoadAccidentCause>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetRoadAccidentCause(roadAccidentCauseOld),
    meta,
  );
};
export const autobaseRemoveRoadAccidentCause = (id: RoadAccidentCause['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteRoadAccidentCause>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteRoadAccidentCause(id),
    meta,
  );
};
