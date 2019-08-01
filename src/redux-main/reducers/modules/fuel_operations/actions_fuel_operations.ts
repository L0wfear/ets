import { FuelOperationActive } from "./@types/fuelOperations";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseCreateFuelOperation, promiseUpdateFuelOperation } from "./promise_fuel_operation";

export const actionCreateFuelOperation = (fuelOperationNew: FuelOperationActive, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateFuelOperation>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateFuelOperation(fuelOperationNew),
    meta,
  );

  return response;
};

export const actionUpdateFuelOperation = (fuelOperationNew: FuelOperationActive, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateFuelOperation>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateFuelOperation(fuelOperationNew),
    meta,
  );

  return response;
};
