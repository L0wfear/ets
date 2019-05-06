import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { ReduxState } from "redux-main/@types/state";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { promiseChangeServiceActiveStatus, promisePostServiceFiles, promiseDeleteServiceFileById } from "./services_promise";
import { Service } from "./@types/services";

export const actionChangeServiceActiveStatus = (slug: string, is_active: boolean, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseChangeServiceActiveStatus>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseChangeServiceActiveStatus(slug, is_active),
    meta,
  );

  return result;
};

export const actionServiceAddFiles = (id: Service['id'], files: any[], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseChangeServiceActiveStatus>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promisePostServiceFiles(id, files),
    meta,
  );

  return result;
};

export const actionServiceRemoveFileById = (id: Service['id'], file_id: number, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseChangeServiceActiveStatus>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseDeleteServiceFileById(id, file_id),
    meta,
  );

  return result;
};
