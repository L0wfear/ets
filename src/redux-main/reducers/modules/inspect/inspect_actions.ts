import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { promiseCloseInspection, promiseUpdateInspection } from './inspect_promise';

export const actionUpdateInspect = (id: number, data: any, files: any[], type: 'autobase', meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseUpdateInspection(
      id,
      data,
      files,
      type,
    ),
    meta,
  );

  return result;
};

export const actionCloseInspect = (id: number, payload: any, type: 'autobase', meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseCloseInspection(
      id,
      payload,
      type,
    ),
    meta,
  );

  return result;
};

const inspectionActions = {
  ...inspectionAutobaseActions,
};

export default inspectionActions;
