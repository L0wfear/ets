import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { Norm } from "./@types";
import { ThunkAction } from "redux-thunk";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseUpdateNorm } from "./promise";

const actionUpdateNorm = (normOwn: Norm, meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateNorm(normOwn),
    meta,
  );

  return response;
};

const normRegistryActions = {
  actionUpdateNorm,
};

export default normRegistryActions;
