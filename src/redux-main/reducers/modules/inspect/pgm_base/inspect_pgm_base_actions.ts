import { actionCompanySetNewData } from 'redux-main/reducers/modules/company/common';

import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { IStateInspectPgmBase, InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { cloneDeep } from 'lodash';
import { INSPECT_PGM_BASE, initialStateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base';
import { actionLoadCompany } from 'redux-main/reducers/modules/company/actions';
import {
  promiseGetInspectPgmBase,
  promiseCreateInspectionPgmBase,
  promiseGetInspectPgmBaseById,
} from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_promise';
import { actionUpdateInspect } from 'redux-main/reducers/modules/inspect/inspect_actions';
import { getTodayCompletedInspect, getTodayConductingInspect } from '../inspect_utils';
import { defaultInspectPgmBase } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/utils';
import { get } from 'lodash';
import { actionsPgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/actions';
import { removeEmptyString } from 'redux-main/reducers/modules/form_data_record/actions';

export const actionSetInspectPgmBase = (partailState: Partial<IStateInspectPgmBase>): EtsAction<IStateInspectPgmBase> => (dispatch, getState) => {
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

export const actionSetInspectPgmBaseInspectPgmBaseList = (inspectPgmBaseList: IStateInspectPgmBase['inspectPgmBaseList']): EtsAction<EtsActionReturnType<typeof actionSetInspectPgmBase>> => (dispatch) => {
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

export const actionGetAndSetInStoreCompany = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionLoadCompany>> => async (dispatch) => {
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

export const actionGetAndSetInStorePgmBase = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionsPgmStore.getArray>> => async (dispatch) => {
  const response = await dispatch(
    actionsPgmStore.getArray(payload, meta),
  );

  dispatch(
    actionSetInspectPgmBase({
      pgmBaseList: response.data,
    }),
  );

  return response;
};

export const actionGetGetInspectPgmBase = (payloadOwn: Parameters<typeof promiseGetInspectPgmBase>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetInspectPgmBase>> => async (dispatch) => {
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

export const actionGetAndSetInStoreInspectPgmBase = (payload: Parameters<typeof actionGetGetInspectPgmBase>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetGetInspectPgmBase>> => async (dispatch) => {
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

const actionGetInspectPgmBaseById = (id: Parameters<typeof promiseGetInspectPgmBaseById>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetInspectPgmBaseById>> => async (dispatch, getState) => {
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

export const actionPushDataInInspectPgmBaseList = (inspectionPgmBase: InspectPgmBase): EtsAction<InspectPgmBase[]> => (dispatch, getState) => {
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

export const actionResetInspectPgmBase = (): EtsAction<null> => (dispatch) => {
  dispatch(
    actionSetInspectPgmBase(initialStateInspectPgmBase),
  );

  return null;
};

export const actionResetInspectPgmBaseList = (): EtsAction<null> => (dispatch) => {
  dispatch(
    actionSetInspectPgmBaseInspectPgmBaseList(
      initialStateInspectPgmBase.inspectPgmBaseList,
    ),
  );

  return null;
};

export const actionResetCompanyAndCarpool = (): EtsAction<null> => (dispatch) => {
  dispatch(
    actionSetInspectPgmBase({
      companyList: initialStateInspectPgmBase.companyList,
      carpoolList: initialStateInspectPgmBase.carpoolList,
    }),
  );

  return null;
};

export const actionCreateInspectPgmBase = (payloadOwn: Parameters<typeof promiseCreateInspectionPgmBase>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateInspectionPgmBase>> => async (dispatch) => {
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

export const actionUpdateInspectPgmBase = (inspectPgmBase: InspectPgmBase, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateInspectionPgmBase>> => async (dispatch) => {
    const data = cloneDeep(inspectPgmBase.data);

    const agents_from_gbu = get(inspectPgmBase, 'agents_from_gbu', defaultInspectPgmBase.agents_from_gbu);
    const commission_members = get(inspectPgmBase, 'commission_members', defaultInspectPgmBase.commission_members);
    const resolve_to = get(inspectPgmBase, 'resolve_to', defaultInspectPgmBase.resolve_to);
    const action = get(inspectPgmBase, 'action', defaultInspectPgmBase.action);

    const payload = {
      data,
      agents_from_gbu,
      commission_members,
      resolve_to,
      head_balance_holder_base: inspectPgmBase.head_balance_holder_base,
      head_operating_base: inspectPgmBase.head_operating_base,
      action,
    };

    const inspectionPgmBase = await dispatch(
      actionUpdateInspect(
        inspectPgmBase.id,
        data,
        inspectPgmBase.files,
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

const actionCloseInspectPgmBase = (inspectPgmBase: InspectPgmBase, meta: LoadingMeta): EtsAction<any> => async (dispatch, getState) => {
  const data = cloneDeep(inspectPgmBase.data);
  removeEmptyString(data);  // мутирует data

  const {
    agents_from_gbu,
    commission_members,
    resolve_to,
  } = inspectPgmBase;

  const payload = {
    data,
    agents_from_gbu,
    commission_members,
    resolve_to,
    head_balance_holder_base: inspectPgmBase.head_balance_holder_base,
    head_operating_base: inspectPgmBase.head_operating_base,
    action: 'close',
  };

  const result = await dispatch(
    actionUpdateInspect(
      inspectPgmBase.id,
      data,
      inspectPgmBase.files,
      meta,
      payload,
    ),
  );

  const inspectionPgmBase = dispatch(
    actionPushDataInInspectPgmBaseList(result),
  );

  return inspectionPgmBase;
};

const inspectionPgmBaseActions = {
  actionSetInspectPgmBaseInspectPgmBaseList,
  actionCompanySetNewData,
  actionGetAndSetInStoreCompany,
  actionGetAndSetInStorePgmBase,
  actionGetGetInspectPgmBase,
  actionGetInspectPgmBaseById,
  actionGetAndSetInStoreInspectPgmBase,
  actionResetInspectPgmBase,
  actionResetInspectPgmBaseList,
  actionResetCompanyAndCarpool,
  actionCreateInspectPgmBase,
  actionUpdateInspectPgmBase,
  actionCloseInspectPgmBase,
};

export default inspectionPgmBaseActions;
