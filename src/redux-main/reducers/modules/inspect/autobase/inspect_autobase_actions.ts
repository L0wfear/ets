import { actionCompanySetNewData } from 'redux-main/reducers/modules/company/common';

import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { IStateInspectAutobase, InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { cloneDeep } from 'lodash';
import { INSPECT_AUTOBASE, initialStateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase';
import { actionLoadCompany } from 'redux-main/reducers/modules/company/actions';
import {
  promiseGetInspectAutobase,
  promiseCreateInspectionAutobase,
  promiseGetInspectAutobaseById,
} from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_promise';
import { actionUpdateInspect } from 'redux-main/reducers/modules/inspect/inspect_actions';
import { getTodayCompletedInspect, getTodayConductingInspect } from '../inspect_utils';
import { defaultInspectAutobase } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/utils';
import { get } from 'lodash';
import { actionsCarpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/actions';
import { removeEmptyString } from 'redux-main/reducers/modules/form_data_record/actions';
import { isArray, isNullOrUndefined } from 'util';

export const actionSetInspectAutobase = (partailState: Partial<IStateInspectAutobase>): EtsAction<IStateInspectAutobase> => (dispatch, getState) => {
  const stateInspectAutobaseOld = getInspectAutobase(getState());

  const stateInspectAutobase = {
    ...stateInspectAutobaseOld,
    ...partailState,
  };

  dispatch({
    type: INSPECT_AUTOBASE.SET_DATA,
    payload: stateInspectAutobase,
  });

  return stateInspectAutobase;
};

export const actionSetInspectAutobaseInspectAutobaseList = (inspectAutobaseList: IStateInspectAutobase['inspectAutobaseList']): EtsAction<EtsActionReturnType<typeof actionSetInspectAutobase>> => (dispatch) => {
  const lastConductingInspect = getTodayConductingInspect(inspectAutobaseList);
  const stateInspectAutobase = dispatch(
    actionSetInspectAutobase({
      inspectAutobaseList,
      lastConductingInspect,
      lastCompletedInspect: lastConductingInspect ? null : getTodayCompletedInspect(inspectAutobaseList),
    }),
  );

  return stateInspectAutobase;
};

export const actionGetAndSetInStoreCompany = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionLoadCompany>> => async (dispatch) => {
  const response = await dispatch(
    actionLoadCompany(payload, meta),
  );

  dispatch(
    actionSetInspectAutobase({
      companyList: response.data,
    }),
  );

  return response;
};

export const actionGetAndSetInStoreCarpool = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionsCarpool.getArray>> => async (dispatch) => {
  const response = await dispatch(
    actionsCarpool.getArray(payload, meta),
  );

  dispatch(
    actionSetInspectAutobase({
      carpoolList: response.data,
    }),
  );

  return response;
};

export const actionGetGetInspectAutobase = (payloadOwn: Parameters<typeof promiseGetInspectAutobase>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetInspectAutobase>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetInspectAutobase(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export const actionGetAndSetInStoreInspectAutobase = (payload: Parameters<typeof actionGetGetInspectAutobase>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetGetInspectAutobase>> => async (dispatch) => {
  dispatch(
    actionResetInspectAutobaseList(),
  );

  const response = await dispatch(
    actionGetGetInspectAutobase(payload, meta),
  );

  dispatch(
    actionSetInspectAutobaseInspectAutobaseList(
      response.data,
    ),
  );

  return response;
};

const actionGetInspectAutobaseById = (id: Parameters<typeof promiseGetInspectAutobaseById>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetInspectAutobaseById>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetInspectAutobaseById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export const actionPushDataInInspectAutobaseList = (inspectionAutobase: InspectAutobase): EtsAction<Array<InspectAutobase>> => (dispatch, getState) => {
  const { inspectAutobaseList } = getInspectAutobase(getState());

  const indexInArrayItem = inspectAutobaseList.findIndex(({ id }) => id === inspectionAutobase.id);

  const inspectAutobaseListNew = [...inspectAutobaseList];

  if (indexInArrayItem) {
    inspectAutobaseListNew[indexInArrayItem] = inspectionAutobase;
  } else {
    inspectAutobaseListNew.push(inspectionAutobase);
  }

  dispatch(
    actionSetInspectAutobaseInspectAutobaseList(
      inspectAutobaseListNew,
    ),
  );

  return inspectAutobaseListNew;
};

export const actionResetInspectAutobase = (): EtsAction<null> => (dispatch) => {
  dispatch(
    actionSetInspectAutobase(initialStateInspectAutobase),
  );

  return null;
};

export const actionResetInspectAutobaseList = (): EtsAction<null> => (dispatch) => {
  dispatch(
    actionSetInspectAutobaseInspectAutobaseList(
      initialStateInspectAutobase.inspectAutobaseList,
    ),
  );

  return null;
};

export const actionResetCompanyAndCarpool = (): EtsAction<null> => (dispatch) => {
  dispatch(
    actionSetInspectAutobase({
      companyList: initialStateInspectAutobase.companyList,
      carpoolList: initialStateInspectAutobase.carpoolList,
    }),
  );

  return null;
};

export const actionCreateInspectAutobase = (payloadOwn: Parameters<typeof promiseCreateInspectionAutobase>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateInspectionAutobase>> => async (dispatch) => {
  const { payload: inspectionAutobase } = await dispatch({
    type: 'none',
    payload: promiseCreateInspectionAutobase(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  const inspectionAutobaseFix = await inspectionAutobase;

  dispatch(
    actionPushDataInInspectAutobaseList(
      inspectionAutobaseFix,
    ),
  );

  return inspectionAutobase;
};

export const actionUpdateInspectAutobase = (inspectAutobase: InspectAutobase, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateInspectionAutobase>> => async (dispatch) => {
  let data = cloneDeep(inspectAutobase.data);
  const agents_from_gbu = get(inspectAutobase, 'agents_from_gbu', defaultInspectAutobase.agents_from_gbu);
  const commission_members = get(inspectAutobase, 'commission_members', defaultInspectAutobase.commission_members);
  const resolve_to = get(inspectAutobase, 'resolve_to', defaultInspectAutobase.resolve_to);
  const action = get(inspectAutobase, 'action', defaultInspectAutobase.action);
  const type = get(inspectAutobase, 'type', defaultInspectAutobase.type);

  const payload = {
    agents_from_gbu,
    commission_members,
    resolve_to,
    action,
    type,
  };

  if (!isNullOrUndefined(data)) {
    data = {
      ...data,
      is_hard_surface: (isArray(data.is_hard_surface) || isNullOrUndefined(data.is_hard_surface)) ? data.is_hard_surface : [data.is_hard_surface],
    };
  }

  const inspectionAutobase = await dispatch(
    actionUpdateInspect(
      inspectAutobase.id,
      data,
      inspectAutobase.files,
      meta,
      payload,
    ),
  );
  dispatch(
    actionPushDataInInspectAutobaseList(
      inspectionAutobase,
    ),
  );

  return inspectionAutobase;
};

const actionCloseInspectAutobase = (inspectAutobase: InspectAutobase, meta: LoadingMeta): EtsAction<any> => async (dispatch, getState) => {
  const data = cloneDeep(inspectAutobase.data);
  removeEmptyString(data);  // мутирует data

  const {
    agents_from_gbu,
    commission_members,
    resolve_to,
    type,
  } = inspectAutobase;

  const payload = {
    data,
    agents_from_gbu,
    commission_members,
    resolve_to,
    action: 'close',
    type,
  };

  const result = await dispatch(
    actionUpdateInspect(
      inspectAutobase.id,
      data,
      inspectAutobase.files,
      meta,
      payload,
    ),
  );

  const inspectionAutobase = dispatch(
    actionPushDataInInspectAutobaseList(result),
  );

  return inspectionAutobase;
};

const inspectionAutobaseActions = {
  actionSetInspectAutobaseInspectAutobaseList,
  actionCompanySetNewData,
  actionGetAndSetInStoreCompany,
  actionGetAndSetInStoreCarpool,
  actionGetGetInspectAutobase,
  actionGetInspectAutobaseById,
  actionGetAndSetInStoreInspectAutobase,
  actionResetInspectAutobase,
  actionResetInspectAutobaseList,
  actionResetCompanyAndCarpool,
  actionCreateInspectAutobase,
  actionUpdateInspectAutobase,
  actionCloseInspectAutobase,
};

export default inspectionAutobaseActions;
