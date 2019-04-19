import { StateProgram } from "./@types/stateProgram";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateStateProgram, promiseUpdateStateProgram } from "./promise_state_program";

export const actionCreateStateProgram = (contractorNew: StateProgram, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateStateProgram>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateStateProgram(contractorNew),
    meta,
  );

  return response;
};

export const actionUpdateStateProgram = (contractorNew: StateProgram, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateStateProgram>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateStateProgram(contractorNew),
    meta,
  );

  return response;
};
