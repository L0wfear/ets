import { FuelOperationActive } from "./@types/fuelOperations";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateFuelOperation, promiseUpdateFuelOperation } from "./promise_fuel_operation";

export const actionCreateFuelOperation = (fuelOperationNew: FuelOperationActive, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateFuelOperation>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateFuelOperation(fuelOperationNew),
    meta,
  );

  return response;
};

export const actionUpdateFuelOperation = (fuelOperationNew: FuelOperationActive, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateFuelOperation>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateFuelOperation(fuelOperationNew),
    meta,
  );

  return response;
};
