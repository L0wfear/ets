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
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionSetMissionTemplate = (
  missionTemplateList: IStateMissions['missionTemplateList'],
): EtsAction<IStateMissions['missionTemplateList']> => (dispatch) => {
  dispatch(
    missionsSetNewData({
      missionTemplateList,
    }),
  );

  return missionTemplateList;
};
export const actionResetMissionTemplate = (): EtsAction<IStateMissions['missionTemplateList']> => (dispatch) => {
  const missionTemplateList = [];

  dispatch(actionSetMissionTemplate(missionTemplateList));

  return missionTemplateList;
};
const actionPrintFormMissionTemplate = (
  payloadOwn: any,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseGetPrintFormMissionTemplate>> => async (dispatch) => {
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

type ThunkActionSetCarsMissionTemplate = EtsAction<Pick<IStateMissions, 'carForMissionTemplateIndex' | 'carForMissionTemplateList'>>;
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
type ThunkActionResetCarsMissionTemplate = EtsAction<
  Pick<
    IStateMissions,
    'carForMissionTemplateIndex' | 'carForMissionTemplateList'
  >
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
): EtsAction<EtsActionReturnType<typeof autobaseGetSetCar>> => async (dispatch) => {
  const response = await dispatch(autobaseGetSetCar(ownPayload, meta));

  return response;
};
export const actionGetAndSetInStoreCarForMission = (
  payload: object,
  meta: LoadingMeta,
): EtsAction<EtsActionReturnType<typeof actionLoadCarsForMissiontemplate>> => async (dispatch) => {
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
): EtsAction<ReturnType<typeof promiseGetMissionTemplate>> => async (dispatch) => {
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
): EtsAction<EtsActionReturnType<typeof actionGetMissionTemplate>> => async (dispatch) => {
  dispatch(actionResetMissionTemplate());

  const response = await dispatch(actionGetMissionTemplate(payloadOwn, meta));

  dispatch(actionSetMissionTemplate(response.data));

  return response;
};
export const actionCreateMissionTemplate = (
  missionTemplateRaw: Partial<MissionTemplate>,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseCreateMissionTemplate>> => async (dispatch) => {
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
): EtsAction<ReturnType<typeof promiseUpdateMissionTemplate>> => async (dispatch) => {
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
): EtsAction<ReturnType<typeof promiseRemoveMissionTemplates>> => async (dispatch) => {
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
): EtsAction<ReturnType<typeof promiseRemoveMissionTemplate>> => async (dispatch) => {
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
