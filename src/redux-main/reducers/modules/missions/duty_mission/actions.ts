import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetDutyMission,
  promiseCreateDutyMission,
  promiseUpdateDutyMission,
  promiseRemoveDutyMissions,
  promiseRemoveDutyMission,
} from 'redux-main/reducers/modules/missions/duty_mission/promise';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { getMissionsState } from 'redux-main/reducers/selectors';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';

export const actionSetDutyMission = (partialDutyMissionData: Partial<IStateMissions['dutyMissionData']>): ThunkAction<IStateMissions['dutyMissionData'], ReduxState, {}, AnyAction> => (dispatch, getState) => {
  const missionState = getMissionsState(getState());
  const newDutyMissionData = {
    ...missionState.dutyMissionData,
    ...partialDutyMissionData,
  };

  dispatch(
    missionsSetNewData({
      dutyMissionData: newDutyMissionData,
    }),
  );

  return newDutyMissionData;
};
export const actionResetDutyMission = (): ThunkAction<IStateMissions['dutyMissionData'], ReduxState, {}, AnyAction> => (dispatch) => {
  const newDutyMissionData = dispatch(
    actionSetDutyMission({
      dutyMissionList: [],
      total_count: 0,
    }),
  );

  return newDutyMissionData;
};
export const actionGetDutyMission = (payloadOwn: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetDutyMission>, ReduxState, {}, AnyAction>  => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetDutyMission(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionGetAndSetInStoreDutyMission: any = (payloadOwn: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionGetDutyMission>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    actionGetDutyMission(payloadOwn, meta),
  );

  dispatch(
    actionSetDutyMission({
      dutyMissionList: response.data,
      total_count: response.total_count,
    }),
  );

  return response;
};
export const actionCreateDutyMission = (dutyDutyMissionRaw: Partial<DutyMission>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateDutyMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateDutyMission(dutyDutyMissionRaw),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionUpdateDutyMission = (dutyDutyMissionOld: DutyMission, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateDutyMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateDutyMission(dutyDutyMissionOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveDutyMissions = (dutyDutyMissionOldArr: (Pick<DutyMission, 'id'> & Partial<DutyMission>)[], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseRemoveDutyMissions>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveDutyMissions(dutyDutyMissionOldArr.map(({ id }) => id)),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionRemoveDutyMission: any = (dutyDutyMissionOld: Pick<DutyMission, 'id'> & Partial<DutyMission>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseRemoveDutyMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveDutyMission(dutyDutyMissionOld.id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export default {
  actionSetDutyMission,
  actionResetDutyMission,
  actionGetDutyMission,
  actionGetAndSetInStoreDutyMission,
  actionCreateDutyMission,
  actionUpdateDutyMission,
  actionRemoveDutyMissions,
  actionRemoveDutyMission,
};
