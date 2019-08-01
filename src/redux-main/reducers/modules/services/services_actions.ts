import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { promiseChangeServiceActiveStatus, promiseChangeServiceFiles } from "./services_promise";
import { Service } from "./@types/services";
import { EtsAction } from "components/@next/ets_hoc/etsUseDispatch";

export const actionChangeServiceActiveStatus = (slug: string, is_active: boolean, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseChangeServiceActiveStatus>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseChangeServiceActiveStatus(slug, is_active),
    meta,
  );

  return result;
};

export const actionChangeServiceFiles = (id: Service['id'], files: any[], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseChangeServiceActiveStatus>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseChangeServiceFiles(id, files),
    meta,
  );

  return result;
};
