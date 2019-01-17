import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetMissionTemplate,
  promiseCreateMissionTemplate,
  promiseUpdateMissionTemplate,
} from 'redux-main/reducers/modules/missions/mission_template/promise';
import { MissionTemplate } from './@types/index.h';

export const actionSetMissionTemplate = (missionTemplateList: IStateMissions['missionTemplateList']) => (dispatch) => (
  dispatch(
    missionsSetNewData({
      missionTemplateList,
    }),
  )
);
export const actionResetMissionTemplate: any = () => (dispatch) => (
  dispatch(
    actionSetMissionTemplate([]),
  )
);
export const actionGetMissionTemplate: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetMissionTemplate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actionGetAndSetInStoreMissionTemplate: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetMissionTemplate(payload, { page, path }),
  );

  dispatch(
    actionSetMissionTemplate(data),
  );

  return {
    driverList: data,
  };
};
export const actionCreateMissionTemplate: any = (missionTemplateRaw: MissionTemplate, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { missionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseCreateMissionTemplate(missionTemplateRaw),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return missionTemplate;
};
export const actionUpdateMissionTemplate: any = (missionTemplateOld: MissionTemplate, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { missionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseUpdateMissionTemplate(missionTemplateOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return missionTemplate;
};

export default {
  actionSetMissionTemplate,
  actionResetMissionTemplate,
  actionGetMissionTemplate,
  actionGetAndSetInStoreMissionTemplate,
  actionCreateMissionTemplate,
  actionUpdateMissionTemplate,
};
