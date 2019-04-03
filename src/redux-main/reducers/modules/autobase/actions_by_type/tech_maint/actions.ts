import { TechMaintenance } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TechMaintenanceExtra } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  getSetTechMaint,
  createSetTechMaint,
  updateSetTechMaint,
  autobaseDeleteTechMaint,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint/promise';
import { autobaseInitialState } from 'redux-main/reducers/modules/autobase/autobase';

/* ---------- TechMaintenance ---------- */
export const autobaseSetTechMaintenance = (techMaintList: TechMaintenance[], techMaintExtra: TechMaintenanceExtra) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techMaintList,
      techMaintExtra,
    }),
  )
);
export const autobaseResetSetTechMaintenance = () => (dispatch) => (
  dispatch(
    autobaseSetTechMaintenance(
      autobaseInitialState.techMaintList,
      autobaseInitialState.techMaintExtra,
    ),
  )
);
export const autobaseGetSetTechMaintenance = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetTechMaint(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const techMaintGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data, extraData } } = await dispatch(
    autobaseGetSetTechMaintenance(payload, { page, path }),
  );

  dispatch(
    autobaseSetTechMaintenance(data, extraData),
  );

  return {
    techMaintList: data,
  };
};
export const autobaseCreateTechMaintenance: any = (techMaintOld: TechMaintenance, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: techMaint } = await dispatch({
    type: 'none',
    payload: createSetTechMaint(techMaintOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return techMaint;
};
export const autobaseUpdateTechMaintenance: any = (techMaintOld: TechMaintenance, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: techMaint } = await dispatch({
    type: 'none',
    payload: updateSetTechMaint(techMaintOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return techMaint;
};
export const autobaseRemoveTechMaintenance = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteTechMaint(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
