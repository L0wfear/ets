import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateInspectCarsCondition, InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { getInspectCarsCondition } from 'redux-main/reducers/selectors';
import { INSPECT_CARS_CONDITION, initialStateInspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition';
import { actionLoadCompany } from 'redux-main/reducers/modules/company/actions';
import {
  promiseCreateInspectionCarsCondition,
  promiseGetInspectCarsConditionById,
  promiseGetSetCarsConditionCars,
} from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_promise';
import { cloneDeep } from 'lodash';
import { actionUpdateInspect, actionCloseInspect } from '../inspect_actions';
import { makeFilesForBackend } from '../autobase/inspect_autobase_promise';
import { createValidDateTime } from 'utils/dates';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionSetInspectCarsCondition = (partailState: Partial<IStateInspectCarsCondition>): ThunkAction<IStateInspectCarsCondition, ReduxState, {}, AnyAction> => (dispatch, getState) => {
  const stateInspectCarsConditionOld = getInspectCarsCondition(getState());

  const stateInspectCarsCondition = {
    ...stateInspectCarsConditionOld,
    ...partailState,
  };

  dispatch({
    type: INSPECT_CARS_CONDITION.SET_DATA,
    payload: stateInspectCarsCondition,
  });

  return stateInspectCarsCondition;
};

export const actionGetAndSetInStoreCompany = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionLoadCompany>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    actionLoadCompany(payload, meta),
  );

  dispatch(
    actionSetInspectCarsCondition({
      companyList: response.data,
    }),
  );

  return response;
};

export const actionGetInspectCarsConditionById = (id: Parameters<typeof promiseGetInspectCarsConditionById>[0], meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof promiseGetInspectCarsConditionById>>, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetInspectCarsConditionById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export const actionResetCompany = (): ThunkAction<null, ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    actionSetInspectCarsCondition({
      companyList: initialStateInspectCarsCondition.companyList,
    }),
  );

  return null;
};

export const actionCreateInspectCarsCondition = (payloadOwn: Parameters<typeof promiseCreateInspectionCarsCondition>[0], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateInspectionCarsCondition>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload: inspectionCarsCondition } = await dispatch({
    type: 'none',
    payload: promiseCreateInspectionCarsCondition(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return inspectionCarsCondition;
};

export const actionUpdateInspectCarsCondition = (inspectCarsCondition: InspectCarsCondition, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateInspectionCarsCondition>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const data = cloneDeep(inspectCarsCondition.data);

  delete data.files;
  delete data.photos_defect;
  delete data.photos_of_supporting_documents;
  const payload = {};

  const inspectionCarsCondition = await dispatch(
    actionUpdateInspect(
      inspectCarsCondition.id,
      data,
      makeFilesForBackend(inspectCarsCondition.data),
      'autobase',
      meta,
      payload,
    ),
  );

  return inspectionCarsCondition;
};

const actionCloseInspectCarsCondition = (inspectCarsCondition: InspectCarsCondition, meta: LoadingMeta): ThunkAction<any, ReduxState, {} , AnyAction> => async (dispatch, getState) => {
  const data = cloneDeep(inspectCarsCondition.data);
  const {
    agents_from_gbu,
    commission_members,
    resolve_to,
  } = inspectCarsCondition;
  delete data.files;
  delete data.photos_of_supporting_documents;
  delete data.photos_defect;

  if (commission_members.length) { // Удаляем первого члена комиссии, бек его сам добавляет
    commission_members.shift();
  }

  const payload = {
    data,
    agents_from_gbu,
    commission_members,
    resolve_to: createValidDateTime(resolve_to),
  };

  const result = await dispatch(
    actionCloseInspect(
      inspectCarsCondition.id,
      payload,
      'autobase',
      meta,
    ),
  );

  return result;
};

const autobaseGetCarsConditionCars = (inspection_id: number, meta: LoadingMeta): ThunkAction<Promise<any>, ReduxState, {} , AnyAction> => async (dispatch, getState) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetSetCarsConditionCars(inspection_id),
    meta,
  );

  return response;
};

const inspectionCarsConditionActions = {
  actionSetInspectCarsCondition,
  actionGetAndSetInStoreCompany,
  actionGetInspectCarsConditionById,
  actionResetCompany,
  actionCreateInspectCarsCondition,
  actionUpdateInspectCarsCondition,
  actionCloseInspectCarsCondition,
  autobaseGetCarsConditionCars,
};

export default inspectionCarsConditionActions;
