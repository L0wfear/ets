import { RepairType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRepairType,
  createSetRepairType,
  updateSetRepairType,
  autobaseDeleteRepairType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair_type/promise';

/* ---------- RepairType ---------- */
export const autobaseSetRepairType = (repairTypeList: RepairType[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      repairTypeList,
    }),
  )
);
export const autobaseResetSetRepairType = () => (dispatch) => (
  dispatch(
    autobaseSetRepairType([]),
  )
);
export const autobaseGetSetRepairType: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetRepairType(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const repairTypeGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetRepairType(payload, { page, path }),
  );

  dispatch(
    autobaseSetRepairType(data),
  );

  return {
    repairTypeList: data,
  };
};
export const autobaseCreateRepairType: any = (repairTypeOld: RepairType, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { repairType } } = await dispatch({
    type: 'none',
    payload: createSetRepairType(repairTypeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return repairType;
};
export const autobaseUpdateRepairType: any = (repairTypeOld: RepairType, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { repairType } } = await dispatch({
    type: 'none',
    payload: updateSetRepairType(repairTypeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return repairType;
};
export const autobaseRemoveRepairType = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteRepairType(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
