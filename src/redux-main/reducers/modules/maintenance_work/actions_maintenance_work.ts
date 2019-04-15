import { MaintenanceWork } from "./@types/maintenanceWork";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateMaintenanceWork, promiseUpdateMaintenanceWork } from "./promise_maintenance_work";

export const actionCreateMaintenanceWork = (maintenanceWorkNew: MaintenanceWork, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateMaintenanceWork>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateMaintenanceWork(maintenanceWorkNew),
    meta,
  );

  return response;
};

export const actionUpdateMaintenanceWork = (maintenanceWorkNew: MaintenanceWork, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateMaintenanceWork>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateMaintenanceWork(maintenanceWorkNew),
    meta,
  );

  return response;
};
