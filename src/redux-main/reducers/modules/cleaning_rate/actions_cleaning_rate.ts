import { CleaningRate } from "./@types/cleaningRate";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateCleaningRate, promiseUpdateCleaningRate } from "./promise_cleaning_rate";

export const actionCreateCleaningRate = (cleaningRateNew: CleaningRate, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateCleaningRate>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateCleaningRate(cleaningRateNew),
    meta,
  );

  return response;
};

export const actionUpdateCleaningRate = (cleaningRateNew: CleaningRate, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateCleaningRate>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCleaningRate(cleaningRateNew),
    meta,
  );

  return response;
};
