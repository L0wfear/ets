import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRoadAccident,
  createSetRoadAccident,
  updateSetRoadAccident,
  autobaseDeleteRoadAccident,
} from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- RoadAccident ---------- */
export const autobaseSetRoadAccident = (roadAccidentList: Array<RoadAccident>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      roadAccidentList,
    }),
  )
);
export const autobaseResetSetRoadAccident = (): EtsAction<EtsActionReturnType<typeof autobaseSetRoadAccident>> => (dispatch) => (
  dispatch(
    autobaseSetRoadAccident([]),
  )
);
export const autobaseGetSetRoadAccident = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetRoadAccident>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSetRoadAccident(payloadOwn),
    meta,
  );
};
export const roadAccidentGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetRoadAccident>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetRoadAccident(payload, meta),
  );

  dispatch(
    autobaseSetRoadAccident(result.data),
  );

  return result;
};
export const autobaseCreateRoadAccident = (roadAccidentOld: RoadAccident, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetRoadAccident>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetRoadAccident(roadAccidentOld),
    meta,
  );
};
export const autobaseUpdateRoadAccident = (roadAccidentOld: RoadAccident, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetRoadAccident>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetRoadAccident(roadAccidentOld),
    meta,
  );
};
export const autobaseRemoveRoadAccident = (id: RoadAccident['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteRoadAccident>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteRoadAccident(id),
    meta,
  );
};
