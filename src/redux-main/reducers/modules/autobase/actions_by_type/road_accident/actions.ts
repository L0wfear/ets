import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRoadAccident,
  createSetRoadAccident,
  updateSetRoadAccident,
  autobaseDeleteRoadAccident,
} from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident/promise';

/* ---------- RoadAccident ---------- */
export const autobaseSetRoadAccident = (roadAccidentList: RoadAccident[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      roadAccidentList,
    }),
  )
);
export const autobaseResetSetRoadAccident = () => (dispatch) => (
  dispatch(
    autobaseSetRoadAccident([]),
  )
);
export const autobaseGetSetRoadAccident = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetRoadAccident(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const roadAccidentGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetRoadAccident(payload, { page, path }),
  );

  dispatch(
    autobaseSetRoadAccident(data),
  );

  return {
    roadAccidentList: data,
  };
};
export const autobaseCreateRoadAccident: any = (roadAccidentOld: RoadAccident, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { roadAccident } } = await dispatch({
    type: 'none',
    payload: createSetRoadAccident(roadAccidentOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return roadAccident;
};
export const autobaseUpdateRoadAccident: any = (roadAccidentOld: RoadAccident, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { roadAccident } } = await dispatch({
    type: 'none',
    payload: updateSetRoadAccident(roadAccidentOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return roadAccident;
};
export const autobaseRemoveRoadAccident = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteRoadAccident(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
