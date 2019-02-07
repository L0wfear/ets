import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetMission,
  promiseCreateMission,
  promiseUpdateMission,
  promiseRemoveMissions,
  promiseRemoveMission,
} from 'redux-main/reducers/modules/missions/mission/promise';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getMissionsState } from 'redux-main/reducers/selectors';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';
import { initialMissionsState } from 'redux-main/reducers/modules/missions';
import { GetMissionPayload } from 'redux-main/reducers/modules/missions/mission/@types';

export const actionSetMission = (partialMissionData: Partial<IStateMissions['missionData']>): ThunkAction<IStateMissions['missionData'], ReduxState, {}, AnyAction> => (dispatch, getState) => {
  const missionState = getMissionsState(getState());

  const newMissionData = {
    ...missionState.missionData,
    ...partialMissionData,
  };

  dispatch(
    missionsSetNewData({
      missionData: newMissionData,
    }),
  );

  return newMissionData;
};
export const actionResetMission = (): ThunkAction<IStateMissions['missionData'], ReduxState, {}, AnyAction> => (dispatch) => {
  const newMissionData = dispatch(
    actionSetMission(initialMissionsState.missionData),
  );

  return newMissionData;
};
export const actionGetMission = (payloadOwn: GetMissionPayload, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetMission>, ReduxState, {}, AnyAction>  => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetMission(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreMission = (payloadOwn: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionGetMission>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    actionGetMission(payloadOwn, meta),
  );

  dispatch(
    actionSetMission({
      list: response.data,
      total_count: response.total_count,
    }),
  );

  return response;
};
export const actionCreateMission = (dutyMissionRaw: Partial<Mission>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateMission(dutyMissionRaw),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionUpdateMission = (dutyMissionOld: Mission, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateMission(dutyMissionOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveMissions = (dutyMissionOldArr: (Pick<Mission, 'id'> & Partial<Mission>)[], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseRemoveMissions>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveMissions(dutyMissionOldArr.map(({ id }) => id)),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveMission: any = (dutyMissionOld: Pick<Mission, 'id'> & Partial<Mission>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseRemoveMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveMission(dutyMissionOld.id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export default {
  actionSetMission,
  actionResetMission,
  actionGetMission,
  actionGetAndSetInStoreMission,
  actionCreateMission,
  actionUpdateMission,
  actionRemoveMissions,
  actionRemoveMission,
};
