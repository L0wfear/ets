import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { Norm } from "./@types";
import { ThunkAction } from "redux-thunk";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseUpdateNorm, promiseGetNormsByParams } from "./promise";

export const actionGetNormsByParams = (payload: Parameters<typeof promiseGetNormsByParams>[0], meta: LoadingMeta): ThunkAction<Promise<Norm[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetNormsByParams(payload),
    meta,
  );

  return response;
};

const actionUpdateNorm = (normOwn: Norm, meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateNorm(normOwn),
    meta,
  );

  return response;
};

const normRegistryActions = {
  actionGetNormsByParams,
  actionUpdateNorm,
};

export default normRegistryActions;
