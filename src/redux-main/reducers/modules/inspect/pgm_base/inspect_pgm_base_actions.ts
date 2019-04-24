import { actionCompanySetNewData } from 'redux-main/reducers/modules/company/common';

import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateInspectPgmBase, InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { cloneDeep } from 'lodash';
import { INSPECT_PGM_BASE, initialStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base';
import { actionLoadCompany } from 'redux-main/reducers/modules/company/actions';
import {
  promiseGetInspectPgmBase,
  promiseCreateInspectionPgmBase,
  promiseGetInspectPgmBaseById,
  makeFilesForBackend,
} from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_promise';
import pgmStoreActions from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/actions';
import { actionCloseInspect, actionUpdateInspect } from 'redux-main/reducers/modules/inspect/inspect_actions';
import { createValidDateTime } from 'utils/dates';
import { getTodayCompletedInspect, getTodayConductingInspect } from '../inspect_utils';

export const actionSetInspectPgmBase = (partailState: Partial<IStateInspectPgmBase>): ThunkAction<IStateInspectPgmBase, ReduxState, {}, AnyAction> => (dispatch, getState) => {
  const stateInspectPgmBaseOld = getInspectPgmBase(getState());

  const stateInspectPgmBase = {
    ...stateInspectPgmBaseOld,
    ...partailState,
  };

  dispatch({
    type: INSPECT_PGM_BASE.SET_DATA,
    payload: stateInspectPgmBase,
  });

  return stateInspectPgmBase;
};

export const actionSetInspectPgmBaseInspectPgmBaseList = (inspectPgmBaseList: IStateInspectPgmBase['inspectPgmBaseList']): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionSetInspectPgmBase>>, ReduxState, {}, AnyAction> => (dispatch) => {
  const lastConductingInspect = getTodayConductingInspect(inspectPgmBaseList);
  const stateInspectPgmBase = dispatch(
    actionSetInspectPgmBase({
      inspectPgmBaseList,
      lastConductingInspect,
      lastCompletedInspect: lastConductingInspect ? null : getTodayCompletedInspect(inspectPgmBaseList),
    }),
  );

  return stateInspectPgmBase;
};

export const actionGetAndSetInStoreCompany = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionLoadCompany>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    actionLoadCompany(payload, meta),
  );

  dispatch(
    actionSetInspectPgmBase({
      companyList: response.data,
    }),
  );

  return response;
};

export const actionGetAndSetInStorePgmBase = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionLoadCompany>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    pgmStoreActions.actionGetGetPgmStore(payload, meta),
  );

  dispatch(
    actionSetInspectPgmBase({
      pgmBaseList: response.data,
    }),
  );

  return response;
};

export const actionGetGetInspectPgmBase = (payloadOwn: Parameters<typeof promiseGetInspectPgmBase>[0], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetInspectPgmBase>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetInspectPgmBase(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export const actionGetAndSetInStoreInspectPgmBase = (payload: Parameters<typeof actionGetGetInspectPgmBase>[0], meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionGetGetInspectPgmBase>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  dispatch(
    actionResetInspectPgmBaseList(),
  );

  const response = await dispatch(
    actionGetGetInspectPgmBase(payload, meta),
  );

  dispatch(
    actionSetInspectPgmBaseInspectPgmBaseList(
      response.data,
    ),
  );

  return response;
};

const actionGetInspectPgmBaseById = (id: Parameters<typeof promiseGetInspectPgmBaseById>[0], meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof promiseGetInspectPgmBaseById>>, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetInspectPgmBaseById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export const actionPushDataInInspectPgmBaseList = (inspectionPgmBase: InspectPgmBase): ThunkAction<InspectPgmBase[], ReduxState, {}, AnyAction> => (dispatch, getState) => {
  const { inspectPgmBaseList } = getInspectPgmBase(getState());

  const indexInArrayItem = inspectPgmBaseList.findIndex(({ id }) => id === inspectionPgmBase.id);

  const inspectPgmBaseListNew = [...inspectPgmBaseList];

  if (indexInArrayItem) {
    inspectPgmBaseListNew[indexInArrayItem] = inspectionPgmBase;
  } else {
    inspectPgmBaseListNew.push(inspectionPgmBase);
  }

  dispatch(
    actionSetInspectPgmBaseInspectPgmBaseList(
      inspectPgmBaseListNew,
    ),
  );

  return inspectPgmBaseListNew;
};

export const actionResetInspectPgmBase = (): ThunkAction<null, ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    actionSetInspectPgmBase(initialStateInspectPgmBase),
  );

  return null;
};

export const actionResetInspectPgmBaseList = (): ThunkAction<null, ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    actionSetInspectPgmBaseInspectPgmBaseList(
      initialStateInspectPgmBase.inspectPgmBaseList,
    ),
  );

  return null;
};

export const actionResetCompanyAndCarpool = (): ThunkAction<null, ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    actionSetInspectPgmBase({
      companyList: initialStateInspectPgmBase.companyList,
      carpoolList: initialStateInspectPgmBase.carpoolList,
    }),
  );

  return null;
};

export const actionCreateInspectPgmBase = (payloadOwn: Parameters<typeof promiseCreateInspectionPgmBase>[0], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateInspectionPgmBase>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload: inspectionPgmBase } = await dispatch({
    type: 'none',
    payload: promiseCreateInspectionPgmBase(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  const inspectionPgmBaseFix = await inspectionPgmBase;

  dispatch(
    actionPushDataInInspectPgmBaseList(
      inspectionPgmBaseFix,
    ),
  );

  return inspectionPgmBase;
};

export const actionUpdateInspectPgmBase = (inspectPgmBase: InspectPgmBase, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateInspectionPgmBase>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const data = cloneDeep(inspectPgmBase.data);

  delete data.files;
  delete data.photos_of_supporting_documents;
  delete data.photos_defect;
  delete data.head_balance_holder_base_tel;
  delete data.head_balance_holder_base_fio;
  delete data.head_operating_base_tel;
  delete data.head_operating_base_fio;

  const payload = {
    head_balance_holder_base: {
      tel: inspectPgmBase.data.head_balance_holder_base_tel,
      fio: inspectPgmBase.data.head_balance_holder_base_fio,
    },
    head_operating_base: {
      tel: inspectPgmBase.data.head_operating_base_tel,
      fio: inspectPgmBase.data.head_operating_base_fio,
    },
  };

  const inspectionPgmBase = await dispatch(
    actionUpdateInspect(
      inspectPgmBase.id,
      data,
      makeFilesForBackend(inspectPgmBase.data),
      'pgm_base',
      meta,
      payload,
    ),
  );

  dispatch(
    actionPushDataInInspectPgmBaseList(
      inspectionPgmBase,
    ),
  );

  return inspectionPgmBase;
};

const actionCloseInspectPgmBase = (inspectPgmBase: InspectPgmBase, meta: LoadingMeta): ThunkAction<any, ReduxState, {} , AnyAction> => async (dispatch, getState) => {
  const data = cloneDeep(inspectPgmBase.data);
  const {
    agents_from_gbu,
    commission_members,
    resolve_to,
  } = inspectPgmBase;
  delete data.files;
  delete data.photos_of_supporting_documents;
  delete data.photos_defect;
  delete data.pgm_volume_sum;
  delete data.summ_capacity;
  delete data.containers_counter;

  const payload = {
    data,
    agents_from_gbu,
    commission_members,
    resolve_to: createValidDateTime(resolve_to),
  };

  const result = await dispatch(
    actionCloseInspect(
      inspectPgmBase.id,
      payload,
      'pgm_base',
      meta,
    ),
  );

  const inspectionPgmBase = dispatch(
    actionPushDataInInspectPgmBaseList(result),
  );

  return inspectionPgmBase;
};

const inspectionPgmBaseActions = {
  actionSetInspectPgmBaseInspectPgmBaseList, // <<< tut
  actionCompanySetNewData,
  actionGetAndSetInStoreCompany,
  actionGetAndSetInStorePgmBase, // << tut
  actionGetGetInspectPgmBase, // << tut
  actionGetInspectPgmBaseById, // << tut
  actionGetAndSetInStoreInspectPgmBase, // << tut
  actionResetInspectPgmBase,
  actionResetInspectPgmBaseList, // << tut
  actionResetCompanyAndCarpool, // << tut
  actionCreateInspectPgmBase,
  actionUpdateInspectPgmBase,
  actionCloseInspectPgmBase,
};

export default inspectionPgmBaseActions;
