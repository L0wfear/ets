import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  promiseLoadCarFuncTypess,
  promiseLoadPFCarFuncTypess,
  promiseCreateCarFuncTypes,
  promiseUpdateCarFuncTypes,
} from 'redux-main/reducers/modules/autobase/car_func_types/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- CarFuncTypes ---------- */
export const autobaseSetCarFuncTypes = (carFuncTypesList: CarFuncTypes[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      carFuncTypesList,
    }),
  )
);
export const autobaseResetSetCarFuncTypes = (): EtsAction<EtsActionReturnType<typeof autobaseSetCarFuncTypes>> => (dispatch) => (
  dispatch(
    autobaseSetCarFuncTypes([]),
  )
);
export const autobaseGetBlobCarFuncTypes = (payloadOwn: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFCarFuncTypess>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadPFCarFuncTypess(payloadOwn),
    meta,
  );
};
export const autobaseGetSetCarFuncTypes = (payloadOwn: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadCarFuncTypess>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadCarFuncTypess(payloadOwn),
    meta,
  );
};

export const carFuncTypesGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetCarFuncTypes>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetCarFuncTypes(payload, meta),
  );

  dispatch(
    autobaseSetCarFuncTypes(result.data),
  );

  return result;
};
export const autobaseCreateCarFuncTypes = (carFuncTypesOld: CarFuncTypes, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateCarFuncTypes>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCreateCarFuncTypes(carFuncTypesOld),
    meta,
  );
};
export const autobaseUpdateCarFuncTypes = (carFuncTypesOld: CarFuncTypes, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateCarFuncTypes>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseUpdateCarFuncTypes(carFuncTypesOld),
    meta,
  );
};
