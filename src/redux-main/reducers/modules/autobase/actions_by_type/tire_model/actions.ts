import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireModel,
  createSetTireModel,
  updateSetTireModel,
  autobaseDeleteTireModel,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_model/promise';

/* ---------- TireModel ---------- */
export const autobaseSetTireModel = (tireModelList: TireModel[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireModelList,
    }),
  )
);
export const autobaseResetSetTireModel = () => (dispatch) => (
  dispatch(
    autobaseSetTireModel([]),
  )
);
export const autobaseGetSetTireModel: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getTireModel(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const tireModelGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetTireModel(payload, { page, path }),
  );

  dispatch(
    autobaseSetTireModel(data),
  );

  return {
    tireModelList: data,
  };
};
export const autobaseCreateTireModel: any = (tireModelOld: TireModel, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { tireModel } } = await dispatch({
    type: 'none',
    payload: createSetTireModel(tireModelOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return tireModel;
};
export const autobaseUpdateTireModel: any = (tireModelOld: TireModel, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { tireModel } } = await dispatch({
    type: 'none',
    payload: updateSetTireModel(tireModelOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return tireModel;
};
export const autobaseRemoveTireModel = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteTireModel(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
