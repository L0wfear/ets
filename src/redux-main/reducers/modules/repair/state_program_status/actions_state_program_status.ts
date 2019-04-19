import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseLoadStateProgramStatus } from "./promise_state_program_status";

export const actionLoadStateProgramStatus = (payload: any, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseLoadStateProgramStatus>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseLoadStateProgramStatus(payload),
    meta,
  );

  return response;
};
