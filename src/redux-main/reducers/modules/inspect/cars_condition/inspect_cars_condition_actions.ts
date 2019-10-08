import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
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
  makeInspectCarsConditionBack,
} from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_promise';
import { cloneDeep } from 'lodash';
import { actionUpdateInspect } from '../inspect_actions';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { removeEmptyString } from 'redux-main/reducers/modules/form_data_record/actions';
import { defaultCarsConditionCar } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/utils';
import { get } from 'lodash';
import { isNullOrUndefined } from 'util';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

const formatedData = (dataOwn: InspectCarsCondition['data']) => {
  const data = cloneDeep(dataOwn);
  data.types_cars = get(data, 'types_cars').map(
    (rowData) => ({
      ...rowData,
      will_checked_cnt: getNumberValueFromSerch(rowData.will_checked_cnt),
      allseason_use_cnt: getNumberValueFromSerch(rowData.allseason_use_cnt),
      checks_period_use_cnt: getNumberValueFromSerch(rowData.checks_period_use_cnt),
    }),
  );

  data.types_harvesting_unit = get(data, 'types_harvesting_unit').map(
    (rowData) => ({
      ...rowData,
      will_checked_cnt: getNumberValueFromSerch(rowData.will_checked_cnt),
      not_ready_cnt: getNumberValueFromSerch(rowData.not_ready_cnt),
      ready_cnt: getNumberValueFromSerch(rowData.ready_cnt),
    }),
  );

  return data;
};

export const actionSetInspectCarsCondition = (partailState: Partial<IStateInspectCarsCondition>): EtsAction<IStateInspectCarsCondition> => (dispatch, getState) => {
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

export const actionGetAndSetInStoreCompany = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionLoadCompany>> => async (dispatch) => {
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

export const actionGetInspectCarsConditionById = (id: Parameters<typeof promiseGetInspectCarsConditionById>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetInspectCarsConditionById>> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetInspectCarsConditionById(id),
    meta,
  );

  return result;
};

export const actionResetCompany = (): EtsAction<null> => (dispatch) => {
  dispatch(
    actionSetInspectCarsCondition({
      companyList: initialStateInspectCarsCondition.companyList,
    }),
  );

  return null;
};

export const actionCreateInspectCarsCondition = (payloadOwn: Parameters<typeof promiseCreateInspectionCarsCondition>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateInspectionCarsCondition>> => async (dispatch) => {
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

export const actionUpdateInspectCarsCondition = (inspectCarsConditionOwn: InspectCarsCondition, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateInspectionCarsCondition>> => async (dispatch) => {
  if (inspectCarsConditionOwn.status !== 'completed' && inspectCarsConditionOwn.status !== 'conducting') {
    const inspectCarsCondition = cloneDeep(inspectCarsConditionOwn);
    const data = formatedData(cloneDeep(inspectCarsCondition.data));

    delete inspectCarsCondition.data;

    const isHasPeriod = Boolean(inspectCarsConditionOwn.checks_period); // разное отображение по типу проверки
    if (isHasPeriod) {
      delete data.cars_use;
      delete data.headcount;
    } else {
      delete data.preparing_cars_check;
    }

    const inspectionCarsCondition = await dispatch(
      actionUpdateInspect(
        inspectCarsCondition.id,
        data,
        inspectCarsCondition.files,
        meta,
        inspectCarsCondition,
      ),
    );

    return inspectionCarsCondition;
  } else {
    const inspectCarsCondition = makeInspectCarsConditionBack(inspectCarsConditionOwn);

    const payload = {
      data: formatedData(inspectCarsCondition.data),
      agents_from_gbu: inspectCarsCondition.agents_from_gbu,
      commission_members: inspectCarsCondition.commission_members,
      resolve_to: inspectCarsCondition.resolve_to,
      action: inspectCarsCondition.action ? inspectCarsCondition.action : 'save',
    };

    const isHasPeriod = Boolean(inspectCarsCondition.checks_period); // разное отображение по типу проверки
    if (isHasPeriod) {
      delete payload.data.cars_use;
      delete payload.data.headcount;
    } else {
      delete payload.data.preparing_cars_check;
    }

    const inspectionCarsCondition = await dispatch(
      actionUpdateInspect(
        inspectCarsCondition.id,
        payload.data,
        inspectCarsCondition.files,
        meta,
        inspectCarsCondition,
      ),
    );

    return inspectionCarsCondition;
  }
};

const actionCloseInspectCarsCondition = (inspectCarsConditionOwn: InspectCarsCondition, meta: LoadingMeta): EtsAction<any> => async (dispatch, getState) => {
  const inspectCarsCondition = makeInspectCarsConditionBack(inspectCarsConditionOwn);
  inspectCarsCondition.action = 'close';

  const data = cloneDeep(inspectCarsCondition.data);
  removeEmptyString(data);  // мутирует data

  const payload = {
    data,
    agents_from_gbu: inspectCarsCondition.agents_from_gbu,
    commission_members: inspectCarsCondition.commission_members,
    resolve_to: inspectCarsCondition.resolve_to,
    action: 'close',
  };

  const isHasPeriod = Boolean(inspectCarsCondition.checks_period); // разное отображение по типу проверки
  if (isHasPeriod) {
    delete payload.data.cars_use;
    delete payload.data.headcount;
  } else {
    delete payload.data.preparing_cars_check;
  }

  const result = await dispatch(
    actionUpdateInspect(
      inspectCarsCondition.id,
      payload.data,
      inspectCarsCondition.files,
      meta,
      inspectCarsCondition,
    ),
  );

  return result;
};

const autobaseGetCarsConditionCars = (inspection_id: number, meta: LoadingMeta): EtsAction<Promise<any>> => async (dispatch, getState) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetSetCarsConditionCars(inspection_id),
    meta,
  );

  return response;
};

export const actionGetCarsConditionsCarById = (id: CarsConditionCars['id'], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetCarsConditionsCarById>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetCarsConditionsCarById(id),
    meta,
  );

  return response;
};

export const actionCreateCarsConditionsCar = (carsConditionsCarRaw: Partial<CarsConditionCars>, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateCarsConditionsCar>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateCarsConditionsCar(carsConditionsCarRaw),
    meta,
  );

  return response;
};

export const actionUpdateCarsConditionsCar = (carsConditionsCarRaw: any, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateCarsConditionsCar>> => async (dispatch) => {
  if (isNullOrUndefined(carsConditionsCarRaw.data)) {
    const defaultCarsConditionCarDataKeys = Object.keys(defaultCarsConditionCar.data);
    const CarsConditionCarData: Partial<CarsConditionCars['data']> = defaultCarsConditionCarDataKeys.reduce((newElem, currentElemKey) => {
      const val =  get(carsConditionsCarRaw, currentElemKey, defaultCarsConditionCar[currentElemKey]);
      delete carsConditionsCarRaw[currentElemKey];
      return {
        [currentElemKey]: val,
        ...newElem,
      };
    }, {});

    carsConditionsCarRaw = {
      ...carsConditionsCarRaw,
      data: {
        ...CarsConditionCarData,
      },
    };
  }

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
