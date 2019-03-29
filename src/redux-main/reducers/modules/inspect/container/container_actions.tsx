import { InspectContainer } from "./@types/container";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseUpdateInspectContainer, promiseCreateInspectContainer } from "./container_promise";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";

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

const inspectContainerActions = {
  actionCreateInspectContainer,
  actionUpdateInspectContainer,
};

export default inspectContainerActions;
