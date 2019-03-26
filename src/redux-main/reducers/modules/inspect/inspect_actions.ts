import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { promiseGetBlobActInspection, promiseCloseInspection, promiseUpdateInspection } from './inspect_promise';
import { TypeOfInspect } from './@types/inspect_reducer';

export const actionGetBlobActInspect = (id: number, meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetBlobActInspection(
      id,
    ),
    meta,
  );

  if (!result.blob) {
    global.NOTIFICATION_SYSTEM.notify('Ошибка формирования акта', 'error', 'tr');
  }

  return result;
};

export const actionUpdateInspect = (id: number, data: any, files: any[], type: TypeOfInspect, meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
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

export const actionCloseInspect = (id: number, data: any, type: TypeOfInspect, meta: LoadingMeta): ThunkAction<any, ReduxState, {}, AnyAction> => async (dispatch, getState) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseCloseInspection(
      id,
      data,
      type,
    ),
    meta,
  );

  return result;
};

const inspectionActions = {
  actionGetBlobActInspect,
  ...inspectionAutobaseActions,
};

export default inspectionActions;
