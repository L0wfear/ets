import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetTire,
  createSetTire,
  cloneSetTire,
  updateSetTire,
  autobaseDeleteTire,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire/promise';

/* ---------- Tire ---------- */
export const autobaseSetTire = (tireList: Tire[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireList,
    }),
  )
);
export const autobaseResetSetTire = () => (dispatch) => (
  dispatch(
    autobaseSetTire([]),
  )
);
export const autobaseGetSetTire = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetTire(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const tireGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetTire(payload, { page, path }),
  );

  dispatch(
    autobaseSetTire(data),
  );

  return {
    tireList: data,
  };
};
export const autobaseCreateTire: any = (tireOld: Tire, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { tire } } = await dispatch({
    type: 'none',
    payload: createSetTire(tireOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return tire;
};
export const autobaseCloneTire: any = (tireId: Tire, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { tire } } = await dispatch({
    type: 'none',
    payload: cloneSetTire(tireId),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return tire;
};
export const autobaseUpdateTire: any = (tireOld: Tire, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { tire } } = await dispatch({
    type: 'none',
    payload: updateSetTire(tireOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return tire;
};
export const autobaseRemoveTire = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteTire(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
