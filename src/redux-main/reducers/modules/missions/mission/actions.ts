import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetMission,
  promiseGetPrintFormMission,
  promiseGetMissionById,
  promiseCreateMission,
  promiseChangeArchiveMissionStatus,
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
import {
  Order,
  OrderTechnicalOperation,
} from 'redux-main/reducers/modules/order/@types';
import { actionLoadOrderById } from 'redux-main/reducers/modules/order/action-order';

const actionSetMissionPartialData = (
  partialMissionData: Partial<IStateMissions['missionData']>,
): ThunkAction<IStateMissions['missionData'], ReduxState, {}, AnyAction> => (
  dispatch,
  getState,
) => {
  const newMissionData = {
    ...getMissionsState(getState()).missionData,
    ...partialMissionData,
  };

  dispatch(
    missionsSetNewData({
      missionData: newMissionData,
    }),
  );

  return newMissionData;
};
const actionResetMission = (): ThunkAction<
  IStateMissions['missionData'],
  ReduxState,
  {},
  AnyAction
> => (dispatch) => {
  const newMissionData = dispatch(
    actionSetMissionPartialData(initialMissionsState.missionData),
  );

  return newMissionData;
};
const actionPrintFormMission = (
  id: Mission['id'],
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseGetPrintFormMission>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetPrintFormMission(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const actionGetMission = (
  payloadOwn: GetMissionPayload,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseGetMission>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
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
const actionGetMissionById = (
  id: Mission['id'],
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseGetMissionById>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetMissionById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionGetAndSetInStoreMission = (
  payloadOwn: object,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<HandleThunkActionCreator<typeof actionGetMission>>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const response = await dispatch(actionGetMission(payloadOwn, meta));

  dispatch(
    actionSetMissionPartialData({
      list: response.data,
      total_count: response.total_count,
    }),
  );

  return response;
};

type ActionSetDependenceOrderDataForMissionAction = ThunkAction<
  ReturnType<HandleThunkActionCreator<typeof actionSetMissionPartialData>>,
  ReduxState,
  {},
  AnyAction
>;
const actionSetDependenceOrderDataForMission = (
  dependeceOrder: IStateMissions['missionData']['dependeceOrder'],
  dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation'],
): ActionSetDependenceOrderDataForMissionAction => (dispatch, getState) => {
  const missionData = dispatch(
    actionSetMissionPartialData({
      ...getMissionsState(getState()).missionData,
      dependeceOrder,
      dependeceTechnicalOperation,
    }),
  );

  return missionData;
};

const actionLoadOrderAndTechnicalOperationById = (
  id: Order['id'],
  operation_id: OrderTechnicalOperation['order_operation_id'],
  meta: LoadingMeta,
) => async (dispatch) => {
  const dependeceOrder: Order = await dispatch(actionLoadOrderById(id, meta));

  dispatch(
    actionSetDependenceOrderDataForMission(
      dependeceOrder,
      dependeceOrder.technical_operations.find(
        ({ order_operation_id }) => order_operation_id === operation_id,
      ),
    ),
  );

  return dependeceOrder;
};

const actionCreateMission = (
  missionRaw: Partial<Mission>,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseCreateMission>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateMission(missionRaw),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionChangeArchiveMissionStatus = (
  missionId: Mission['id'],
  is_archive: boolean,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseChangeArchiveMissionStatus>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseChangeArchiveMissionStatus(missionId, is_archive),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const actionUpdateMission = (
  missionOld: Mission,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseUpdateMission>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateMission(missionOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionRemoveMissions = (
  missionOldArr: (Pick<Mission, 'id'> & Partial<Mission>)[],
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseRemoveMissions>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveMissions(missionOldArr.map(({ id }) => id)),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionRemoveMission: any = (
  missionOld: Pick<Mission, 'id'> & Partial<Mission>,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseRemoveMission>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveMission(missionOld.id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export default {
  actionSetMissionPartialData,
  actionResetMission,
  actionPrintFormMission,
  actionGetMission,
  actionGetMissionById,
  actionGetAndSetInStoreMission,
  actionSetDependenceOrderDataForMission,
  actionLoadOrderAndTechnicalOperationById,
  actionCreateMission,
  actionChangeArchiveMissionStatus,
  actionUpdateMission,
  actionRemoveMissions,
  actionRemoveMission,
};
