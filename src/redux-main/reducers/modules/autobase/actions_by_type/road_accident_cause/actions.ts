import { RoadAccidentCause } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRoadAccidentCause,
  createSetRoadAccidentCause,
  updateSetRoadAccidentCause,
  autobaseDeleteRoadAccidentCause,
} from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident_cause/promise';

/* ---------- RoadAccidentCause ---------- */
export const autobaseSetRoadAccidentCause = (roadAccidentCauseList: RoadAccidentCause[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      roadAccidentCauseList,
    }),
  )
);
export const autobaseResetSetRoadAccidentCause = () => (dispatch) => (
  dispatch(
    autobaseSetRoadAccidentCause([]),
  )
);
export const autobaseGetSetRoadAccidentCause: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetRoadAccidentCause(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const roadAccidentCauseGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetRoadAccidentCause(payload, { page, path }),
  );

  dispatch(
    autobaseSetRoadAccidentCause(data),
  );

  return {
    roadAccidentCauseList: data,
  };
};
export const autobaseCreateRoadAccidentCause: any = (roadAccidentCauseOld: RoadAccidentCause, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: roadAccidentCause } = await dispatch({
    type: 'none',
    payload: createSetRoadAccidentCause(roadAccidentCauseOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return roadAccidentCause;
};
export const autobaseUpdateRoadAccidentCause: any = (roadAccidentCauseOld: RoadAccidentCause, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: roadAccidentCause } = await dispatch({
    type: 'none',
    payload: updateSetRoadAccidentCause(roadAccidentCauseOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return roadAccidentCause;
};
export const autobaseRemoveRoadAccidentCause = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteRoadAccidentCause(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
