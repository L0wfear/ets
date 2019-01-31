import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetDutyMissionTemplate,
  promiseCreateDutyMissionTemplate,
  promiseUpdateDutyMissionTemplate,
  promiseRemoveDutyMissionTemplates,
  promiseRemoveDutyMissionTemplate,
} from 'redux-main/reducers/modules/missions/duty_mission_template/promise';
import { DutyMissionTemplate } from './@types/index.h';

export const actionSetDutyMissionTemplate = (dutyMissionTemplateList: IStateMissions['dutyMissionTemplateList']) => (dispatch) => (
  dispatch(
    missionsSetNewData({
      dutyMissionTemplateList,
    }),
  )
);
export const actionResetDutyMissionTemplate: any = () => (dispatch) => (
  dispatch(
    actionSetDutyMissionTemplate([]),
  )
);
export const actionGetDutyMissionTemplate: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetDutyMissionTemplate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreDutyMissionTemplate: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetDutyMissionTemplate(payload, { page, path }),
  );

  dispatch(
    actionSetDutyMissionTemplate(data),
  );

  return {
    dutyDutyMissionTemplateList: data,
  };
};
export const actionCreateDutyMissionTemplate: any = (dutyDutyMissionTemplateRaw: DutyMissionTemplate, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { dutyDutyMissionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseCreateDutyMissionTemplate(dutyDutyMissionTemplateRaw),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return dutyDutyMissionTemplate;
};
export const actionUpdateDutyMissionTemplate: any = (dutyDutyMissionTemplateOld: DutyMissionTemplate, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { dutyDutyMissionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseUpdateDutyMissionTemplate(dutyDutyMissionTemplateOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return dutyDutyMissionTemplate;
};
export const actionRemoveDutyMissionTemplates: any = (dutyDutyMissionTemplateOldArr: DutyMissionTemplate[], { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { dutyDutyMissionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseRemoveDutyMissionTemplates(dutyDutyMissionTemplateOldArr.map(({ id }) => id)),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return dutyDutyMissionTemplate;
};
export const actionRemoveDutyMissionTemplate: any = (dutyDutyMissionTemplateOld: Pick<DutyMissionTemplate, 'id'> & Partial<DutyMissionTemplate>, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { dutyDutyMissionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseRemoveDutyMissionTemplate(dutyDutyMissionTemplateOld.id),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return dutyDutyMissionTemplate;
};

export default {
  actionSetDutyMissionTemplate,
  actionResetDutyMissionTemplate,
  actionGetDutyMissionTemplate,
  actionGetAndSetInStoreDutyMissionTemplate,
  actionCreateDutyMissionTemplate,
  actionUpdateDutyMissionTemplate,
  actionRemoveDutyMissionTemplates,
  actionRemoveDutyMissionTemplate,
};
