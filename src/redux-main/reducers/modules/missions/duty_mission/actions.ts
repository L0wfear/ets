import { missionsSetNewData } from 'redux-main/reducers/modules/missions/common';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import {
  promiseGetDutyMission,
  promiseGetPrintFormDutyMission,
  promiseGetDutyMissionById,
  promiseCreateDutyMission,
  promiseChangeArchiveDutuMissionStatus,
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
import { initialMissionsState } from 'redux-main/reducers/modules/missions';
import missionActions from 'redux-main/reducers/modules/missions/mission/actions';
import { GetMissionPayload } from 'redux-main/reducers/modules/missions/mission/@types';
import { Order, OrderTechnicalOperation } from 'redux-main/reducers/modules/order/@types';
import { actionLoadOrderById } from 'redux-main/reducers/modules/order/action-order';
import { get } from 'lodash';
import edcRequestActions from '../../edc_request/edc_request_actions';

const actionSetDutyMissionPartialData = (partialDutyMissionData: Partial<IStateMissions['dutyMissionData']>): ThunkAction<IStateMissions['dutyMissionData'], ReduxState, {}, AnyAction> => (dispatch, getState) => {
  const newDutyMissionData = {
    ...getMissionsState(getState()).dutyMissionData,
    ...partialDutyMissionData,
  };

  dispatch(
    missionsSetNewData({
      dutyMissionData: newDutyMissionData,
    }),
  );

  return newDutyMissionData;
};
const actionResetDutyMission = (): ThunkAction<IStateMissions['dutyMissionData'], ReduxState, {}, AnyAction> => (dispatch) => {
  const newDutyMissionData = dispatch(
    actionSetDutyMissionPartialData(initialMissionsState.dutyMissionData),
  );

  return newDutyMissionData;
};
const actionPrintFormDutyMission = (id: DutyMission['id'], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetPrintFormDutyMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetPrintFormDutyMission(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const actionGetDutyMission = (payloadOwn: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetDutyMission>, ReduxState, {}, AnyAction>  => async (dispatch) => {
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
const actionGetDutyMissionById = (id: DutyMission['id'], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetDutyMissionById>, ReduxState, {}, AnyAction>  => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetDutyMissionById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionGetAndSetInStoreDutyMission = (payloadOwn: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionGetDutyMission>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  dispatch(actionResetDutyMission());

  const response = await dispatch(
    actionGetDutyMission(payloadOwn, meta),
  );

  dispatch(
    actionSetDutyMissionPartialData({
      dutyMissionList: response.data,
      total_count: response.total_count,
    }),
  );

  return response;
};
const actionGetAvaliableMissionsToBind = (payloadOwn: GetMissionPayload, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof missionActions.actionGetMission>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    missionActions.actionGetMission(
      payloadOwn,
      meta,
    ),
  );

  return response;
};
const actionGetAndSetInStoreAvalilableMissionsToBind = (payloadOwn: GetMissionPayload, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionGetAvaliableMissionsToBind>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    actionGetAvaliableMissionsToBind(payloadOwn, meta),
  );

  dispatch(
    actionSetDutyMissionPartialData({
      availableMissionsToBind: response.data,
    }),
  );

  return response;
};

type ActionSetDependenceEdcRequestForMission = ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionSetDutyMissionPartialData>>, ReduxState, {}, AnyAction>;
const actionSetDependenceEdcRequestForDutyMission = (edcRequest: IStateMissions['dutyMissionData']['edcRequest']): ActionSetDependenceEdcRequestForMission => (
  (dispatch, getState) => {
    const missionData = dispatch(
      actionSetDutyMissionPartialData({
        ...getMissionsState(getState()).missionData,
        edcRequest,
      }),
    );

    return missionData;
  }
);

const loadEdcRequiedByIdForDutyMission = (id: number, meta: LoadingMeta) => async (dispatch) => {
  const edcRequest = await dispatch(
    edcRequestActions.actionLoadEdcRequestById(id, meta),
  );

  dispatch(
    actionSetDependenceEdcRequestForDutyMission(
      edcRequest,
    ),
  );

  return edcRequest;
};

type ActionSetDependenceOrderDataForDutyMissionAction = ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionSetDutyMissionPartialData>>, ReduxState, {}, AnyAction>;
const actionSetDependenceOrderDataForDutyMission = (dependeceOrder: IStateMissions['dutyMissionData']['dependeceOrder'], dependeceTechnicalOperation: IStateMissions['dutyMissionData']['dependeceTechnicalOperation']): ActionSetDependenceOrderDataForDutyMissionAction => (
  (dispatch, getState) => {
    const dutyMissionData = dispatch(
      actionSetDutyMissionPartialData({
        ...getMissionsState(getState()).dutyMissionData,
        dependeceOrder,
        dependeceTechnicalOperation,
      }),
    );

    return dutyMissionData;
  }
);

const actionLoadOrderAndTechnicalOperationByIdForDutyMission = (id: Order['id'], operation_id: OrderTechnicalOperation['order_operation_id'], meta: LoadingMeta) => async (dispatch) => {
  const dependeceOrder: Order = await dispatch(
    actionLoadOrderById(id, meta),
  );

  dispatch(
    actionSetDependenceOrderDataForDutyMission(
      dependeceOrder,
      get(dependeceOrder, 'technical_operations', []).find(({ order_operation_id }) => order_operation_id === operation_id),
    ),
  );

  return dependeceOrder;
};

const actionCreateDutyMission = (dutyDutyMissionRaw: Partial<DutyMission>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateDutyMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
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
const actionChangeArchiveDutuMissionStatus = (dutyMissionId: DutyMission['id'], is_archive: boolean, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseChangeArchiveDutuMissionStatus>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseChangeArchiveDutuMissionStatus(dutyMissionId, is_archive),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const actionUpdateDutyMission = (dutyDutyMissionOld: DutyMission, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateDutyMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
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
const actionRemoveDutyMissions = (dutyDutyMissionOldArr: (Pick<DutyMission, 'id'> & Partial<DutyMission>)[], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseRemoveDutyMissions>, ReduxState, {}, AnyAction> => async (dispatch) => {
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
const actionRemoveDutyMission: any = (dutyDutyMissionOld: Pick<DutyMission, 'id'> & Partial<DutyMission>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseRemoveDutyMission>, ReduxState, {}, AnyAction> => async (dispatch) => {
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

type ActionReseSetDependenceMissionDataForDutyMissionForm = ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionSetDutyMissionPartialData>>, ReduxState, {}, AnyAction>;
const actionReseSetDependenceMissionDataForDutyMissionForm = (): ActionReseSetDependenceMissionDataForDutyMissionForm => (
  (dispatch, getState) => {
    const missionData = dispatch(
      actionSetDutyMissionPartialData({
        ...getMissionsState(getState()).dutyMissionData,
        dependeceOrder: initialMissionsState.missionData.dependeceOrder,
        dependeceTechnicalOperation: initialMissionsState.missionData.dependeceTechnicalOperation,
        edcRequest: initialMissionsState.missionData.edcRequest,
      }),
    );

    return missionData;
  }
);

export default {
  actionSetDutyMissionPartialData,
  actionResetDutyMission,
  actionPrintFormDutyMission,
  actionGetDutyMission,
  actionGetDutyMissionById,
  actionGetAndSetInStoreDutyMission,
  actionGetAvaliableMissionsToBind,
  actionGetAndSetInStoreAvalilableMissionsToBind,
  actionSetDependenceOrderDataForDutyMission,
  actionLoadOrderAndTechnicalOperationByIdForDutyMission,
  actionCreateDutyMission,
  actionChangeArchiveDutuMissionStatus,
  actionUpdateDutyMission,
  actionRemoveDutyMissions,
  actionRemoveDutyMission,
  actionSetDependenceEdcRequestForDutyMission,
  loadEdcRequiedByIdForDutyMission,
  actionReseSetDependenceMissionDataForDutyMissionForm,
};
