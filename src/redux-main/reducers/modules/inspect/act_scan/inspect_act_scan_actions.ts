import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { InspectOneActScan } from "./@types/inspect_act_scan";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { promiseChangeActFiles } from "./inspect_act_scan_promise";

export const actionChangeActFiles = (fileData: InspectOneActScan, meta: LoadingMeta): EtsAction<Promise<InspectOneActScan>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseChangeActFiles(fileData),
    meta,
  );
};
