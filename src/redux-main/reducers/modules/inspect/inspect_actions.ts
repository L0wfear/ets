import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { promiseGetBlobActInspection, promiseUpdatePreparePlan } from './inspect_promise';
import { TypeOfInspect } from './@types/inspect_reducer';
import inspectContainerActions from './container/container_actions';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { promiseCreateInspectionAutobase, promiseUpdateInspectionAutobase } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_promise';
import { promiseCreateInspectionPgmBase, promiseUpdateInspectionPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_promise';
import { promiseCreateInspectionCarsCondition, promiseUpdateInspectionCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_promise';

export const actionGetBlobActInspect = (id: number, meta: LoadingMeta, format?: string): EtsAction<any> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetBlobActInspection(
      id,
      format
    ),
    meta,
  );

  if (!result.blob) {
    global.NOTIFICATION_SYSTEM.notify('Ошибка формирования акта', 'error', 'tr');
  }

  return result;
};

export const actionCreateInspect = (payload: any, company_id: number, type: TypeOfInspect, meta: LoadingMeta): EtsAction<any> => async (dispatch, getState) => {
  const createPromise
  = type === 'autobase'
    ? promiseCreateInspectionAutobase
    : type === 'pgm_base'
      ? promiseCreateInspectionPgmBase
      : promiseCreateInspectionCarsCondition;
  const result = await etsLoadingCounter(
    dispatch,
    createPromise({
      ...payload,
      company_id,
    }),
    meta,
  );

  return result;
};

export const actionUpdateInspect = (id: number, data: any, files: Array<any>, meta: LoadingMeta, payload: any ): EtsAction<any> => async (dispatch) => {
  const { type } = payload;
  const updatePromise
  = type === 'autobase'
    ? promiseUpdateInspectionAutobase
    : type === 'pgm_base'
      ? promiseUpdateInspectionPgmBase
      : promiseUpdateInspectionCarsCondition;
  const result = await etsLoadingCounter(
    dispatch,
    updatePromise(
      id,
      data,
      files,
      payload,
    ),
    meta,
  );

  return result;
};

export const actionUpdatePreparePlan = (id: number, meta: LoadingMeta, payload: {types_cars: InspectCarsCondition['data']['types_cars']; types_harvesting_unit: InspectCarsCondition['data']['types_harvesting_unit'];} ): EtsAction<any> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseUpdatePreparePlan(
      id,
      payload,
    ),
    meta,
  );

  return result;
};

const inspectionActions = {
  actionCreateInspect,
  actionGetBlobActInspect,
  inspectionAutobaseActions,
  inspectionPgmBaseActions,
  inspectContainerActions,
};

export default inspectionActions;
