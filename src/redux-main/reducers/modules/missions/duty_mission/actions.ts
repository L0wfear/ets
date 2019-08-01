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
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { HandleThunkActionCreator } from 'react-redux';
import { initialMissionsState } from 'redux-main/reducers/modules/missions';
import missionActions from 'redux-main/reducers/modules/missions/mission/actions';
import { GetMissionPayload } from 'redux-main/reducers/modules/missions/mission/@types';
import { Order, OrderTechnicalOperation } from 'redux-main/reducers/modules/order/@types';
import { actionLoadOrderById } from 'redux-main/reducers/modules/order/action-order';
import { get } from 'lodash';
import edcRequestActions from '../../edc_request/edc_request_actions';
import { DUTY_MISSION_STATUS } from '../mission/constants';
import { isArray } from 'util';

const actionSetDutyMissionPartialData = (partialDutyMissionData: Partial<IStateMissions['dutyMissionData']>): EtsAction<IStateMissions['dutyMissionData']> => (dispatch, getState) => {
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
const actionResetDutyMission = (): EtsAction<IStateMissions['dutyMissionData']> => (dispatch) => {
  const newDutyMissionData = dispatch(
    actionSetDutyMissionPartialData(initialMissionsState.dutyMissionData),
  );

  return newDutyMissionData;
};
const actionPrintFormDutyMission = (id: DutyMission['id'], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetPrintFormDutyMission>> => async (dispatch) => {
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

const actionGetDutyMission = (payloadOwn: object, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetDutyMission>>  => async (dispatch) => {
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
const actionGetDutyMissionById = (id: DutyMission['id'], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetDutyMissionById>>  => async (dispatch) => {
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
const actionGetAndSetInStoreDutyMission = (payloadOwn: object, meta: LoadingMeta): EtsAction<ReturnType<HandleThunkActionCreator<typeof actionGetDutyMission>>> => async (dispatch) => {
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
const actionGetAvaliableMissionsToBind = (payloadOwn: GetMissionPayload, meta: LoadingMeta): EtsAction<ReturnType<HandleThunkActionCreator<typeof missionActions.actionGetMission>>> => async (dispatch) => {
  const response = await dispatch(
    missionActions.actionGetMission(
      payloadOwn,
      meta,
    ),
  );

  return response;
};
const actionGetAndSetInStoreAvalilableMissionsToBind = (payloadOwn: GetMissionPayload, meta: LoadingMeta): EtsAction<ReturnType<HandleThunkActionCreator<typeof actionGetAvaliableMissionsToBind>>> => async (dispatch) => {
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

type ActionSetDependenceEdcRequestForMission = EtsAction<ReturnType<HandleThunkActionCreator<typeof actionSetDutyMissionPartialData>>>;
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

type ActionSetDependenceOrderDataForDutyMissionAction = EtsAction<ReturnType<HandleThunkActionCreator<typeof actionSetDutyMissionPartialData>>>;
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

const actionCreateDutyMission = (dutyDutyMissionRaw: Partial<DutyMission>, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateDutyMission>> => async (dispatch) => {
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
const actionChangeArchiveDutuMissionStatus = (dutyMissionId: DutyMission['id'], is_archive: boolean, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseChangeArchiveDutuMissionStatus>> => async (dispatch) => {
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

const actionUpdateDutyMission = (dutyDutyMissionOld: DutyMission, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateDutyMission>> => async (dispatch) => {
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
const actionRemoveDutyMissions = (dutyDutyMissionOldArr: (Pick<DutyMission, 'id'> & Partial<DutyMission>)[], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseRemoveDutyMissions>> => async (dispatch) => {
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
const actionRemoveDutyMission: any = (dutyDutyMissionOld: Pick<DutyMission, 'id'> & Partial<DutyMission>, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseRemoveDutyMission>> => async (dispatch) => {
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

export const actionCompleteDutyMissionByIds: any = (id: DutyMission['id'] | DutyMission['id'][], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const ids = isArray(id) ? id : [id];

  return Promise.all(
    ids.map((dutyMissionId) => (
      dispatch(
        actionCompleteDutyMissionById(
          dutyMissionId,
          meta,
        ),
      )
    )),
  );
};

export const actionCompleteDutyMissionById: any = (id: DutyMission['id'], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const dutyMission = await dispatch(
    actionGetDutyMissionById(
      id,
      meta,
    ),
  );

  if (dutyMission) {
    const response = await dispatch(
      actionUpdateDutyMission(
        {
          ...dutyMission,
          status: DUTY_MISSION_STATUS.complete,
        },
        meta,
      ),
    );

    return response;
  }

  return false;
};

export const actionToArchiveDutyMissionByIds: any = (id: DutyMission['id'] | DutyMission['id'][], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const ids = isArray(id) ? id : [id];

  return Promise.all(
    ids.map((dutyMissionId) => (
      dispatch(
        actionChangeArchiveDutuMissionStatus(
          dutyMissionId,
          true,
          meta,
        ),
      )
    )),
  );
};

export const actionFailDutyMissionsByPartialData: any = (partialDutyMission: DutyMission | DutyMission[], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const arrays = isArray(partialDutyMission) ? partialDutyMission : [partialDutyMission];

  return Promise.all(
    arrays.map((partialDutyMissionData) => (
      dispatch(
        actionCompleteDutyMissionById(
          partialDutyMissionData,
          meta,
        ),
      )
    )),
  );
};

export const actionFailDutyMissionByPartialData: any = (partialDutyMission: DutyMission, meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const dutyMission = await dispatch(
    actionGetDutyMissionById(
      partialDutyMission.id,
      meta,
    ),
  );

  if (dutyMission) {
    const response = await dispatch(
      actionUpdateDutyMission(
        {
          ...dutyMission,
          comment: partialDutyMission.comment,
          status: DUTY_MISSION_STATUS.fail,
        },
        meta,
      ),
    );

    return response;
  }

  return false;
};

export const actionFromArchiveDutyMissionByIds: any = (id: DutyMission['id'] | DutyMission['id'][], meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const ids = isArray(id) ? id : [id];

  return Promise.all(
    ids.map((dutyMissionId) => (
      dispatch(
        actionChangeArchiveDutuMissionStatus(
          dutyMissionId,
          false,
          meta,
        ),
      )
    )),
  );
};

type ActionReseSetDependenceMissionDataForDutyMissionForm = EtsAction<ReturnType<HandleThunkActionCreator<typeof actionSetDutyMissionPartialData>>>;
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
