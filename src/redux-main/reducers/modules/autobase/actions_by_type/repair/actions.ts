import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRepair,
  createSetRepair,
  updateSetRepair,
  autobaseDeleteRepair,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair/promise';

/* ---------- Repair ---------- */
export const autobaseSetRepair = (repairList: Repair[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      repairList,
    }),
  )
);
export const autobaseResetSetRepair = () => (dispatch) => (
  dispatch(
    autobaseSetRepair([]),
  )
);
export const autobaseGetSetRepair = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetRepair(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const repairGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetRepair(payload, { page, path }),
  );

  dispatch(
    autobaseSetRepair(data),
  );

  return {
    repairList: data,
  };
};
export const autobaseCreateRepair: any = (repairOld: Repair, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { repair } } = await dispatch({
    type: 'none',
    payload: createSetRepair(repairOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return repair;
};
export const autobaseUpdateRepair: any = (repairOld: Repair, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { repair } } = await dispatch({
    type: 'none',
    payload: updateSetRepair(repairOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return repair;
};
export const autobaseRemoveRepair = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteRepair(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
