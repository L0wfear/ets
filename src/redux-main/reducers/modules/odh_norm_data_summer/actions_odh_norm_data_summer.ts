import { OdhNormDataSummer } from "./@types/odhNormDataSummer";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateOdhNormDataSummer, promiseUpdateOdhNormDataSummer } from "./promise_odh_norm_data_summer";

export const actionCreateOdhNormDataSummer = (odhNormDataSummerNew: OdhNormDataSummer, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateOdhNormDataSummer>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateOdhNormDataSummer(odhNormDataSummerNew),
    meta,
  );

  return response;
};

export const actionUpdateOdhNormDataSummer = (odhNormDataSummerNew: OdhNormDataSummer, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateOdhNormDataSummer>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateOdhNormDataSummer(odhNormDataSummerNew),
    meta,
  );

  return response;
};
