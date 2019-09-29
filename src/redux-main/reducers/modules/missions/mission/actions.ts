import { get } from 'lodash';
import { isArray } from 'util';

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
  getMissionDataById,
  promiseGetMissionReassignationParameters,
  promisePostMissionReassignationParameters,
  promisePutMissionReassignationParameters,
} from 'redux-main/reducers/modules/missions/mission/promise';
import { Mission, MissionDataType, MissionReassignation } from 'redux-main/reducers/modules/missions/mission/@types';
import { getMissionsState } from 'redux-main/reducers/selectors';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { initialMissionsState } from 'redux-main/reducers/modules/missions';
import { GetMissionPayload } from 'redux-main/reducers/modules/missions/mission/@types';
import {
  Order,
  OrderTechnicalOperation,
} from 'redux-main/reducers/modules/order/@types';
import { actionLoadOrderById } from 'redux-main/reducers/modules/order/action-order';
import { autobaseGetSetCar } from 'redux-main/reducers/modules/autobase/car/actions';

import edcRequestActions from '../../edc_request/edc_request_actions';
import { MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';

import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import { actionGetWaybillById } from 'redux-main/reducers/modules/waybill/waybill_actions';

const actionSetMissionPartialData = (partialMissionData: Partial<IStateMissions['missionData']>): EtsAction<IStateMissions['missionData']> => (
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
const actionResetMission = (): EtsAction<IStateMissions['missionData']> => (dispatch) => {
  const newMissionData = dispatch(
    actionSetMissionPartialData(initialMissionsState.missionData),
  );

  return newMissionData;
};

const actionSetCarsMission = (
  carsList: IStateMissions['missionData']['carsList'],
  carsIndex: IStateMissions['missionData']['carsIndex'],
): EtsAction<Pick<IStateMissions['missionData'], 'carsIndex' | 'carsList'>> => (dispatch) => {
  dispatch(
    actionSetMissionPartialData({
      carsList,
      carsIndex,
    }),
  );

  return {
    carsList,
    carsIndex,
  };
};

const actionLoadCarsForMission = (
  ownPayload: object,
  meta: LoadingMeta,
): EtsAction<EtsActionReturnType<typeof autobaseGetSetCar>> => async (dispatch) => {
  const response = await dispatch(autobaseGetSetCar(ownPayload, meta));

  return response;
};

const actionGetAndSetInStoreCarForMission = (
  payload: object,
  meta: LoadingMeta,
): EtsAction<EtsActionReturnType<typeof actionLoadCarsForMission>> => async (dispatch) => {
  const { data, dataIndex } = await dispatch(
    actionLoadCarsForMission(payload, meta),
  );

  dispatch(actionSetCarsMission(data, dataIndex));

  return {
    data,
    dataIndex,
  };
};

const actionResetCarsMission = (): EtsAction<Pick<IStateMissions['missionData'], 'carsIndex' | 'carsList'>> => (dispatch) => {
  const carsList = [];
  const carsIndex = {};
  dispatch(
    actionSetCarsMission(
      carsList,
      carsIndex,
    ),
  );

  return {
    carsList,
    carsIndex,
  };
};

const actionPrintFormMission = (payloadOwn: any, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetPrintFormMission>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetPrintFormMission(payloadOwn),
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
): EtsAction<ReturnType<typeof promiseGetMission>> => async (dispatch) => {
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
): EtsAction<ReturnType<typeof promiseGetMissionById>> => async (dispatch) => {
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
): EtsAction<EtsActionReturnType<typeof actionGetMission>> => async (dispatch) => {
  dispatch(actionResetMission());

  const response = await dispatch(actionGetMission(payloadOwn, meta));

  dispatch(
    actionSetMissionPartialData({
      list: response.data,
      total_count: response.total_count,
    }),
  );

  return response;
};

type ActionSetDependenceOrderDataForMission = EtsAction<EtsActionReturnType<typeof actionSetMissionPartialData>>;
const actionSetDependenceOrderDataForMission = (dependeceOrder: IStateMissions['missionData']['dependeceOrder'], dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation']): ActionSetDependenceOrderDataForMission => (
  (dispatch, getState) => {
    const missionData = dispatch(
      actionSetMissionPartialData({
        ...getMissionsState(getState()).missionData,
        dependeceOrder,
        dependeceTechnicalOperation,
      }),
    );

    return missionData;
  }
);

type ActionSetDependenceEdcRequestForMission = EtsAction<EtsActionReturnType<typeof actionSetMissionPartialData>>;
const actionSetDependenceEdcRequestForMission = (edcRequest: IStateMissions['missionData']['edcRequest']): ActionSetDependenceEdcRequestForMission => (
  (dispatch, getState) => {
    const missionData = dispatch(
      actionSetMissionPartialData({
        ...getMissionsState(getState()).missionData,
        edcRequest,
      }),
    );

    return missionData;
  }
);

type ActionSetDependenceWaybillDataForMission = EtsAction<EtsActionReturnType<typeof actionSetMissionPartialData>>;
const actionSetDependenceWaybillDataForMission = (waybillData: IStateMissions['missionData']['waybillData']): ActionSetDependenceWaybillDataForMission => (
  (dispatch, getState) => {
    const missionData = dispatch(
      actionSetMissionPartialData({
        ...getMissionsState(getState()).missionData,
        waybillData,
      }),
    );

    return missionData;
  }
);

const loadEdcRequiedByIdForMission = (id: number, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof edcRequestActions.actionLoadEdcRequestById>> => async (dispatch) => {
  const edcRequest = await dispatch(
    edcRequestActions.actionLoadEdcRequestById(id, meta),
  );

  dispatch(
    actionSetDependenceEdcRequestForMission(
      edcRequest,
    ),
  );

  return edcRequest;
};

const actionLoadWaybillDataByIdForMission = (
  waybill_id: number,
  meta: LoadingMeta,
): EtsAction<EtsActionReturnType<typeof actionGetWaybillById>> => async (dispatch) => {
  const waybillData = await dispatch(actionGetWaybillById(waybill_id, meta));

  dispatch(
    actionSetDependenceWaybillDataForMission(
      waybillData,
    ),
  );

  return waybillData;
};

const actionLoadOrderAndTechnicalOperationByIdForMission = (
  id: Order['id'],
  operation_id: OrderTechnicalOperation['order_operation_id'],
  meta: LoadingMeta,
): EtsAction<EtsActionReturnType<typeof actionLoadOrderById>> => async (dispatch) => {
  const dependeceOrder: Order = await dispatch(actionLoadOrderById(id, meta));

  dispatch(
    actionSetDependenceOrderDataForMission(
      dependeceOrder,
      get(dependeceOrder, 'technical_operations', []).find(
        ({ order_operation_id }) => order_operation_id === operation_id,
      ),
    ),
  );

  return dependeceOrder;
};

const actionCreateMission = (
  missionRaw: Partial<Mission>,
  assign_to_waybill: string[],
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseCreateMission>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCreateMission(missionRaw, assign_to_waybill, false),
    meta,
  );
};
const actionChangeArchiveMissionStatus = (
  missionId: Mission['id'],
  is_archive: boolean,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseChangeArchiveMissionStatus>> => async (dispatch) => {
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
  missionOld: Mission & { action_at?: string },
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseUpdateMission>> => async (dispatch) => {
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
): EtsAction<ReturnType<typeof promiseRemoveMissions>> => async (dispatch) => {
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
const actionRemoveMission = (
  id: Mission['id'],
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseRemoveMission>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseRemoveMission(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export const actionCompleteMissionByIds = (id: Mission['id'] | Mission['id'][], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const ids = isArray(id) ? id : [id];
  // формировать новый массив объектов
  return Promise.all(
    ids.map((missionId) => (
      dispatch(
        actionCompleteMissionById(
          missionId,
          meta,
        ),
      )
    )),
  );
};

export const actionCompleteMissionById = (id: Mission['id'], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const mission = await dispatch(
    actionGetMissionById(
      id,
      meta,
    ),
  );

  const time = await dispatch(
    actionLoadTimeMoscow(
      {},
      meta,
    ),
  );

  if (mission) {
    const response = await dispatch(
      actionUpdateMission(
        {
          ...mission,
          action_at: time.date,
          status: MISSION_STATUS.complete,
        },
        meta,
      ),
    );

    // console.log('actionCompleteMissionById response == ', { response });
    return response;
  }

  return false;
};

export const actionToArchiveMissionByIds = (id: Mission['id'] | Mission['id'][], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const ids = isArray(id) ? id : [id];

  return Promise.all(
    ids.map((missionId) => (
      dispatch(
        actionChangeArchiveMissionStatus(
          missionId,
          true,
          meta,
        ),
      )
    )),
  );
};

export const actionFromArchiveMissionByIds = (id: Mission['id'] | Mission['id'][], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const ids = isArray(id) ? id : [id];

  return Promise.all(
    ids.map((missionId) => (
      dispatch(
        actionChangeArchiveMissionStatus(
          missionId,
          false,
          meta,
        ),
      )
    )),
  );
};

export const actionLoadMissionData = (id: Mission['id'], meta: LoadingMeta): EtsAction<Promise<MissionDataType>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    getMissionDataById(id),
    meta,
  );

  return result;
};

type ActionReseSetDependenceMissionDataForMissionForm = EtsAction<EtsActionReturnType<typeof actionSetMissionPartialData>>;
const actionReseSetDependenceMissionDataForMissionForm = (): ActionReseSetDependenceMissionDataForMissionForm => (
  (dispatch, getState) => {
    const missionData = dispatch(
      actionSetMissionPartialData({
        ...getMissionsState(getState()).missionData,
        waybillData: initialMissionsState.missionData.waybillData,
        dependeceOrder: initialMissionsState.missionData.dependeceOrder,
        dependeceTechnicalOperation: initialMissionsState.missionData.dependeceTechnicalOperation,
        edcRequest: initialMissionsState.missionData.edcRequest,
        carsList: initialMissionsState.missionData.carsList,
        carsIndex: initialMissionsState.missionData.carsIndex,
      }),
    );

    return missionData;
  }
);

export const actionGetMissionReassignationParameters = (payload: Parameters<typeof promiseGetMissionReassignationParameters>[0], meta: LoadingMeta): EtsAction<Promise<MissionReassignation>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetMissionReassignationParameters(payload),
    meta,
  );

  return response;
};

export const actionPostMissionReassignationParameters = (payload: Parameters<typeof promisePostMissionReassignationParameters>[0], meta: LoadingMeta): EtsAction<Promise<MissionReassignation>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promisePostMissionReassignationParameters(payload),
    meta,
  );

  return response;
};

export const actionPutMissionReassignationParameters = (payload: Parameters<typeof promisePutMissionReassignationParameters>[0], meta: LoadingMeta): EtsAction<Promise<MissionReassignation>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promisePutMissionReassignationParameters(payload),
    meta,
  );

  return response;
};

export default {
  actionSetMissionPartialData,
  actionSetCarsMission,
  actionResetMission,
  actionResetCarsMission,
  actionPrintFormMission,
  actionLoadCarsForMission,
  actionGetAndSetInStoreCarForMission,
  actionGetMission,
  actionGetMissionById,
  actionGetAndSetInStoreMission,
  actionSetDependenceOrderDataForMission,
  actionSetDependenceEdcRequestForMission,
  loadEdcRequiedByIdForMission,
  actionLoadWaybillDataByIdForMission,
  actionSetDependenceWaybillDataForMission,
  actionLoadOrderAndTechnicalOperationByIdForMission,
  actionCreateMission,
  actionChangeArchiveMissionStatus,
  actionUpdateMission,
  actionRemoveMissions,
  actionRemoveMission,
  actionReseSetDependenceMissionDataForMissionForm,
};
