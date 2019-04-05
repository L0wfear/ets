import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseLoadCountry } from "./promise";
import { Country } from "./@types";

export const actionLoadCountry = (payload: object, meta: LoadingMeta): ThunkAction<Promise<Country[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseLoadCountry(payload),
    meta,
  );

  return response;
};
