import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";

import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { InspectActScan, InspectOneActScan } from "./@types/inspect_act_scan";
import { ReduxState } from "redux-main/@types/state";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseLoadActFileData, promisePostActFileData, promisePutActFileData } from "./inspect_act_scan_promise";

export const actionLoadActFileData = (file_id: InspectActScan['id'], meta: LoadingMeta): ThunkAction<Promise<InspectOneActScan>, ReduxState, {}, AnyAction> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadActFileData(file_id),
    meta,
  );
};

export const actionPostActFileData = (fileData: InspectOneActScan, meta: LoadingMeta): ThunkAction<Promise<InspectOneActScan>, ReduxState, {}, AnyAction> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promisePostActFileData(fileData),
    meta,
  );
};

export const actionPutActFileData = (fileData: InspectOneActScan, meta: LoadingMeta): ThunkAction<Promise<InspectOneActScan>, ReduxState, {}, AnyAction> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promisePutActFileData(fileData),
    meta,
  );
};
