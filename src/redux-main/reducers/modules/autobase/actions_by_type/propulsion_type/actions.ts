import { PropulsionType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getPropulsionType,
  createSetPropulsionType,
  updateSetPropulsionType,
  autobaseDeletePropulsionType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/propulsion_type/promise';

/* ---------- PropulsionType ---------- */
export const autobaseSetPropulsionType = (propulsionTypeList: PropulsionType[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      propulsionTypeList,
    }),
  )
);
export const autobaseResetSetPropulsionType = () => (dispatch) => (
  dispatch(
    autobaseSetPropulsionType([]),
  )
);
export const autobaseGetSetPropulsionType: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getPropulsionType(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const propulsionTypeGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetPropulsionType(payload, { page, path }),
  );

  dispatch(
    autobaseSetPropulsionType(data),
  );

  return {
    propulsionTypeList: data,
  };
};
export const autobaseCreatePropulsionType: any = (propulsionTypeOld: PropulsionType, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: propulsionType } = await dispatch({
    type: 'none',
    payload: createSetPropulsionType(propulsionTypeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return propulsionType;
};
export const autobaseUpdatePropulsionType: any = (propulsionTypeOld: PropulsionType, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: propulsionType } = await dispatch({
    type: 'none',
    payload: updateSetPropulsionType(propulsionTypeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return propulsionType;
};
export const autobaseRemovePropulsionType = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeletePropulsionType(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
