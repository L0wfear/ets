import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetRepairCompany,
  createSetRepairCompany,
  updateSetRepairCompany,
  autobaseDeleteRepairCompany,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/promise';

/* ---------- RepairCompany ---------- */
export const autobaseSetRepairCompany = (repairCompanyList: RepairCompany[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      repairCompanyList,
    }),
  )
);
export const autobaseResetSetRepairCompany = () => (dispatch) => (
  dispatch(
    autobaseSetRepairCompany([]),
  )
);
export const autobaseGetSetRepairCompany: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetRepairCompany(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const repairCompanyGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetRepairCompany(payload, { page, path }),
  );

  dispatch(
    autobaseSetRepairCompany(data),
  );

  return {
    repairCompanyList: data,
  };
};
export const autobaseCreateRepairCompany: any = (repairCompanyOld: RepairCompany, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { repairCompany } } = await dispatch({
    type: 'none',
    payload: createSetRepairCompany(repairCompanyOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return repairCompany;
};
export const autobaseUpdateRepairCompany: any = (repairCompanyOld: RepairCompany, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { repairCompany } } = await dispatch({
    type: 'none',
    payload: updateSetRepairCompany(repairCompanyOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return repairCompany;
};
export const autobaseRemoveRepairCompany = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteRepairCompany(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
