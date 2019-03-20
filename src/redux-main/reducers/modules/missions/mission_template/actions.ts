import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetMissionTemplate,
  promiseCreateMissionTemplate,
  promiseUpdateMissionTemplate,
  promiseRemoveMissionTemplates,
  promiseRemoveMissionTemplate,
  promiseGetPrintFormMissionTemplate,
} from 'redux-main/reducers/modules/missions/mission_template/promise';
import { MissionTemplate } from './@types/index.h';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { autobaseGetSetCar } from 'redux-main/reducers/modules/autobase/car/actions';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';

export const actionSetMissionTemplate = (
  missionTemplateList: IStateMissions['missionTemplateList'],
): ThunkAction<
  IStateMissions['missionTemplateList'],
  ReduxState,
  {},
  AnyAction
> => (dispatch) => {
  dispatch(
    missionsSetNewData({
      missionTemplateList,
    }),
  );

  return missionTemplateList;
};
export const actionResetMissionTemplate = (): ThunkAction<
  IStateMissions['missionTemplateList'],
  ReduxState,
  {},
  AnyAction
> => (dispatch) => {
  const missionTemplateList = [];

  dispatch(actionSetMissionTemplate(missionTemplateList));

  return missionTemplateList;
};
const actionPrintFormMissionTemplate = (
  payloadOwn: any,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseGetPrintFormMissionTemplate>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetPrintFormMissionTemplate(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

type ThunkActionSetCarsMissionTemplate = ThunkAction<
  Pick<
    IStateMissions,
    'carForMissionTemplateIndex' | 'carForMissionTemplateList'
  >,
  ReduxState,
  {},
  AnyAction
>;
export const actionSetCarsMissionTemplate = (
  carForMissionTemplateList: IStateMissions['carForMissionTemplateList'],
  carForMissionTemplateIndex: IStateMissions['carForMissionTemplateIndex'],
): ThunkActionSetCarsMissionTemplate => (dispatch) => {
  dispatch(
    missionsSetNewData({
      carForMissionTemplateList,
      carForMissionTemplateIndex,
    }),
  );

  return {
    carForMissionTemplateList,
    carForMissionTemplateIndex,
  };
};
type ThunkActionResetCarsMissionTemplate = ThunkAction<
  Pick<
    IStateMissions,
    'carForMissionTemplateIndex' | 'carForMissionTemplateList'
  >,
  ReduxState,
  {},
  AnyAction
>;
export const actionResetCarsMissionTemplate = (): ThunkActionResetCarsMissionTemplate => (
  dispatch,
) => {
  const carForMissionTemplateList = [];
  const carForMissionTemplateIndex = {};
  dispatch(
    actionSetCarsMissionTemplate(
      carForMissionTemplateList,
      carForMissionTemplateIndex,
    ),
  );

  return {
    carForMissionTemplateList,
    carForMissionTemplateIndex,
  };
};
export const actionLoadCarsForMissiontemplate = (
  ownPayload: object,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<HandleThunkActionCreator<typeof autobaseGetSetCar>>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const response = await dispatch(autobaseGetSetCar(ownPayload, meta));

  return response;
};
export const actionGetAndSetInStoreCarForMission = (
  payload: object,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<HandleThunkActionCreator<typeof actionLoadCarsForMissiontemplate>>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { data, dataIndex } = await dispatch(
    actionLoadCarsForMissiontemplate(payload, meta),
  );

  dispatch(actionSetCarsMissionTemplate(data, dataIndex));

  return {
    data,
    dataIndex,
  };
};
export const actionGetMissionTemplate = (
  payloadOwn: object,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseGetMissionTemplate>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetMissionTemplate(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreMissionTemplate = (
  payloadOwn: object,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<HandleThunkActionCreator<typeof actionGetMissionTemplate>>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const response = await dispatch(actionGetMissionTemplate(payloadOwn, meta));

  dispatch(actionSetMissionTemplate(response.data));

  return response;
};
export const actionCreateMissionTemplate = (
  missionTemplateRaw: Partial<MissionTemplate>,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseCreateMissionTemplate>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateMissionTemplate(missionTemplateRaw),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionUpdateMissionTemplate = (
  missionTemplateOld: Partial<MissionTemplate> & Pick<MissionTemplate, 'id'>,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseUpdateMissionTemplate>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateMissionTemplate(missionTemplateOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveMissionTemplates = (
  missionTemplateOldArr: (Partial<MissionTemplate> &
    Pick<MissionTemplate, 'id'>)[],
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseRemoveMissionTemplates>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveMissionTemplates(
      missionTemplateOldArr.map(({ id }) => id),
    ),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveMissionTemplate = (
  missionTemplateOld: Pick<MissionTemplate, 'id'> & Partial<MissionTemplate>,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseRemoveMissionTemplate>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveMissionTemplate(missionTemplateOld.id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export default {
  actionSetMissionTemplate,
  actionResetMissionTemplate,
  actionPrintFormMissionTemplate,
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
