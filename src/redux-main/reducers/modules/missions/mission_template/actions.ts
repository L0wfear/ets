import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetMissionTemplate,
  promiseCreateMissionTemplate,
  promiseUpdateMissionTemplate,
  promiseRemoveMissionTemplates,
  promiseRemoveMissionTemplate,
} from 'redux-main/reducers/modules/missions/mission_template/promise';
import { MissionTemplate } from './@types/index.h';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { autobaseGetSetCar } from '../../autobase/car/actions';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';

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
export const actionSetCarsMissionTemplate = (carForMissionTemplateList: IStateMissions['carForMissionTemplateList'], carForMissionTemplateIndex: IStateMissions['carForMissionTemplateIndex']) => (dispatch) => (
  dispatch(
    missionsSetNewData({
      carForMissionTemplateList,
      carForMissionTemplateIndex,
    }),
  )
);
export const actionResetCarsMissionTemplate = (): ThunkAction<null, ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    actionSetCarsMissionTemplate([], {}),
  );

  return null;
};
export const actionLoadCarsForMissiontemplate = (ownPayload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof autobaseGetSetCar>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    autobaseGetSetCar(
      ownPayload,
      meta,
    ),
  );

  return response;
};
export const actionGetAndSetInStoreCarForMission = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionLoadCarsForMissiontemplate>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const {
    data,
    dataIndex,
  } = await dispatch(
    actionLoadCarsForMissiontemplate(payload, meta),
  );

  dispatch(
    actionSetCarsMissionTemplate(
      data,
      dataIndex,
    ),
  );

  return {
    data,
    dataIndex,
  };
};
export const actionGetMissionTemplate: any = (payload = {}, meta: LoadingMeta) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetMissionTemplate(payload),
    meta: {
      promise: true,
      ...meta,
    },
  })
);
export const actionGetAndSetInStoreMissionTemplate: any = (payload = {}, meta: LoadingMeta) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetMissionTemplate(payload, meta),
  );

  dispatch(
    actionSetMissionTemplate(data),
  );

  return {
    missionTemplateList: data,
  };
};
export const actionCreateMissionTemplate: any = (missionTemplateRaw: MissionTemplate, meta: LoadingMeta) => async (dispatch) => {
  const { payload: { missionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseCreateMissionTemplate(missionTemplateRaw),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return missionTemplate;
};
export const actionUpdateMissionTemplate: any = (missionTemplateOld: MissionTemplate, meta: LoadingMeta) => async (dispatch) => {
  const { payload: { missionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseUpdateMissionTemplate(missionTemplateOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return missionTemplate;
};
export const actionRemoveMissionTemplates: any = (missionTemplateOldArr: MissionTemplate[], meta: LoadingMeta) => async (dispatch) => {
  const { payload: { missionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseRemoveMissionTemplates(missionTemplateOldArr.map(({ id }) => id)),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return missionTemplate;
};
export const actionRemoveMissionTemplate: any = (missionTemplateOld: Pick<MissionTemplate, 'id'> & Partial<MissionTemplate>, meta: LoadingMeta) => async (dispatch) => {
  const { payload: { missionTemplate } } = await dispatch({
    type: 'none',
    payload: promiseRemoveMissionTemplate(missionTemplateOld.id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return missionTemplate;
};

export default {
  actionSetMissionTemplate,
  actionResetMissionTemplate,
  actionGetMissionTemplate,
  actionGetAndSetInStoreMissionTemplate,
  actionSetCarsMissionTemplate,
  actionResetCarsMissionTemplate,
  actionLoadCarsForMissiontemplate,
  actionGetAndSetInStoreCarForMission,
  actionCreateMissionTemplate,
  actionUpdateMissionTemplate,
  actionRemoveMissionTemplates,
  actionRemoveMissionTemplate,
};
