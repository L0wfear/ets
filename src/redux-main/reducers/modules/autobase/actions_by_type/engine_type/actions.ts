import { EngineType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getEngineType,
  createSetEngineType,
  updateSetEngineType,
  autobaseDeleteEngineType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/engine_type/promise';

/* ---------- EngineType ---------- */
export const autobaseSetEngineType = (engineTypeList: EngineType[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      engineTypeList,
    }),
  )
);
export const autobaseResetSetEngineType = () => (dispatch) => (
  dispatch(
    autobaseSetEngineType([]),
  )
);
export const autobaseGetSetEngineType: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getEngineType(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const engineTypeGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetEngineType(payload, { page, path }),
  );

  dispatch(
    autobaseSetEngineType(data),
  );

  return {
    engineTypeList: data,
  };
};
export const autobaseCreateEngineType: any = (engineTypeOld: EngineType, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: engineType } = await dispatch({
    type: 'none',
    payload: createSetEngineType(engineTypeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return engineType;
};
export const autobaseUpdateEngineType: any = (engineTypeOld: EngineType, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: engineType } = await dispatch({
    type: 'none',
    payload: updateSetEngineType(engineTypeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return engineType;
};
export const autobaseRemoveEngineType = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteEngineType(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
