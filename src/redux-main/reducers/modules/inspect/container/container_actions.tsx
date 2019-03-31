import { InspectContainer } from "./@types/container";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseUpdateInspectContainer, promiseCreateInspectContainer, promiseGetInspectContainer, promiseRemoveInspectContainer } from "./container_promise";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { PgmStore } from "../../geoobject/actions_by_type/pgm_store/@types";

const actionGetInspectContainer = (inspection_id: PgmStore['id'], meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetInspectContainer(
      inspection_id,
    ),
    meta,
  );

  return result;
};

const actionCreateInspectContainer = (inspectContainer: InspectContainer, meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseCreateInspectContainer(
      inspectContainer,
    ),
    meta,
  );

  return result;
};

const actionUpdateInspectContainer = (inspectContainer: InspectContainer, meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseUpdateInspectContainer(
      inspectContainer,
    ),
    meta,
  );

  return result;
};

const actionRemoveInspectContainer = (inspection_id: PgmStore['id'], meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseRemoveInspectContainer(
      inspection_id,
    ),
    meta,
  );

  return result;
};

const inspectContainerActions = {
  actionGetInspectContainer,
  actionCreateInspectContainer,
  actionUpdateInspectContainer,
  actionRemoveInspectContainer,
};

export default inspectContainerActions;
