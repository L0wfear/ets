import { TechMaint } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TechMaintExtra } from '../../@types/autobase.h';
import {
  getSetTechMaint,
  createSetTechMaint,
  updateSetTechMaint,
  autobaseDeleteTechMaint,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint/promise';
import { autobaseInitialState } from 'redux-main/reducers/modules/autobase/autobase';

/* ---------- TechMaint ---------- */
export const autobaseSetTechMaint = (techMaintList: TechMaint[], techMaintExtra: TechMaintExtra) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techMaintList,
      techMaintExtra,
    }),
  )
);
export const autobaseResetSetTechMaint = () => (dispatch) => (
  dispatch(
    autobaseSetTechMaint(
      autobaseInitialState.techMaintList,
      autobaseInitialState.techMaintExtra,
    ),
  )
);
export const autobaseGetSetTechMaint = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
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
    autobaseGetSetTechMaint(payload, { page, path }),
  );

  dispatch(
    autobaseSetTechMaint(data, extraData),
  );

  return {
    techMaintList: data,
  };
};
export const autobaseCreateTechMaint: any = (techMaintOld: TechMaint, { page, path }: { page: string; path?: string }) => async (dispatch) => {
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
export const autobaseUpdateTechMaint: any = (techMaintOld: TechMaint, { page, path }: { page: string; path?: string }) => async (dispatch) => {
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
export const autobaseRemoveTechMaint = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
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
