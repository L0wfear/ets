import { StateProgram } from "./@types/stateProgram";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseCreateStateProgram, promiseUpdateStateProgram } from "./promise_state_program";
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionCreateStateProgram = (contractorNew: StateProgram, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateStateProgram>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateStateProgram(contractorNew),
    meta,
  );

  return response;
};

export const actionUpdateStateProgram = (contractorNew: StateProgram, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateStateProgram>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateStateProgram(contractorNew),
    meta,
  );

  return response;
};
