import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";

import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { InspectOneActScan } from "./@types/inspect_act_scan";
import { ReduxState } from "redux-main/@types/state";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseChangeActFiles } from "./inspect_act_scan_promise";

export const actionChangeActFiles = (fileData: InspectOneActScan, meta: LoadingMeta): ThunkAction<Promise<InspectOneActScan>, ReduxState, {}, AnyAction> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseChangeActFiles(fileData),
    meta,
  );
};
