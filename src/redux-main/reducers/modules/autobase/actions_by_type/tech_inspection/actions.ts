import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetTechInspection,
  createSetTechInspection,
  updateSetTechInspection,
  autobaseDeleteTechInspection,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_inspection/promise';

/* ---------- TechInspection ---------- */
export const autobaseSetTechInspection = (techInspectionList: TechInspection[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techInspectionList,
    }),
  )
);
export const autobaseResetSetTechInspection = () => (dispatch) => (
  dispatch(
    autobaseSetTechInspection([]),
  )
);
export const autobaseGetSetTechInspection = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetTechInspection(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const techInspectionGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetTechInspection(payload, { page, path }),
  );

  dispatch(
    autobaseSetTechInspection(data),
  );

  return {
    techInspectionList: data,
  };
};
export const autobaseCreateTechInspection: any = (techInspectionOld: TechInspection, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { techInspection } } = await dispatch({
    type: 'none',
    payload: createSetTechInspection(techInspectionOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return techInspection;
};
export const autobaseUpdateTechInspection: any = (techInspectionOld: TechInspection, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { techInspection } } = await dispatch({
    type: 'none',
    payload: updateSetTechInspection(techInspectionOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return techInspection;
};
export const autobaseRemoveTechInspection = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteTechInspection(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
