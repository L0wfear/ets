import { Contractor } from "./@types/contractor";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateContractor, promiseUpdateContractor } from "./promise_contractor";

export const actionCreateContractor = (contractorNew: Contractor, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateContractor>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateContractor(contractorNew),
    meta,
  );

  return response;
};

export const actionUpdateContractor = (contractorNew: Contractor, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateContractor>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateContractor(contractorNew),
    meta,
  );

  return response;
};
