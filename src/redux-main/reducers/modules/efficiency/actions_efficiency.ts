import { Efficiency } from "./@types/efficiency";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateEfficiency, promiseUpdateEfficiency } from "./promise_efficiency";

export const actionCreateEfficiency = (efficiencyNew: Efficiency, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateEfficiency>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateEfficiency(efficiencyNew),
    meta,
  );

  return response;
};

export const actionUpdateEfficiency = (efficiencyNew: Efficiency, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateEfficiency>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateEfficiency(efficiencyNew),
    meta,
  );

  return response;
};
