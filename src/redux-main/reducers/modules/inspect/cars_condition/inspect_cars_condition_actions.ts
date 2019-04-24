import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateInspectCarsCondition, InspectCarsCondition, CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { getInspectCarsCondition } from 'redux-main/reducers/selectors';
import { INSPECT_CARS_CONDITION, initialStateInspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition';
import { actionLoadCompany } from 'redux-main/reducers/modules/company/actions';
import {
  promiseCreateInspectionCarsCondition,
  promiseGetInspectCarsConditionById,
  promiseGetSetCarsConditionCars,
  promiseCreateCarsConditionsCar,
  promiseUpdateCarsConditionsCar,
  promiseGetCarsConditionsCarById,
} from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_promise';
import { cloneDeep } from 'lodash';
import { actionUpdateInspect } from '../inspect_actions';
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

export const actionUpdateInspectCarsCondition = (inspectCarsConditionOwn: InspectCarsCondition, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateInspectionCarsCondition>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const inspectCarsCondition = cloneDeep(inspectCarsConditionOwn);
  const data = cloneDeep(inspectCarsCondition.data);

  delete inspectCarsCondition.data;

  const isHasPeriod = Boolean(inspectCarsConditionOwn.checks_period); // разное отображение по типу проверки
  if (isHasPeriod) {
    delete data.cars_use;
    delete data.headcount_list;
  } else {
    delete data.preparing_cars_check;
  }

  const inspectionCarsCondition = await dispatch(
    actionUpdateInspect(
      inspectCarsCondition.id,
      data,
      inspectCarsCondition.files,
      'cars_condition',
      meta,
      inspectCarsCondition,
    ),
  );

  return inspectionCarsCondition;
};

const actionCloseInspectCarsCondition = (inspectCarsCondition: InspectCarsCondition, meta: LoadingMeta): ThunkAction<any, ReduxState, {} , AnyAction> => async (dispatch, getState) => {
  throw new Error('');
};

const autobaseGetCarsConditionCars = (inspection_id: number, meta: LoadingMeta): ThunkAction<Promise<any>, ReduxState, {} , AnyAction> => async (dispatch, getState) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetSetCarsConditionCars(inspection_id),
    meta,
  );

  return response;
};

export const actionGetCarsConditionsCarById = (id: CarsConditionCars['id'], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetCarsConditionsCarById>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetCarsConditionsCarById(id),
    meta,
  );

  return response;
};

export const actionCreateCarsConditionsCar = (carsConditionsCarRaw: Partial<CarsConditionCars>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateCarsConditionsCar>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateCarsConditionsCar(carsConditionsCarRaw),
    meta,
  );

  return response;
};

export const actionUpdateCarsConditionsCar = (carsConditionsCarRaw: Partial<CarsConditionCars>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateCarsConditionsCar>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCarsConditionsCar(carsConditionsCarRaw),
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
