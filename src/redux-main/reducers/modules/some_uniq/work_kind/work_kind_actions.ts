import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetWorkKind } from 'redux-main/reducers/modules/some_uniq/work_kind/work_kind_promise';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { WorkKind } from './@types/work_kind';

export const actionSetWorkKind = (workKindList: IStateSomeUniq['workKindList']): ThunkAction<IStateSomeUniq['workKindList'], ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      workKindList,
    }),
  );

  return workKindList;
};
export const actionResetWorkKind = (): ThunkAction<IStateSomeUniq['workKindList'], ReduxState, {}, AnyAction> => (dispatch) => {
  const workKindList = dispatch(
    actionSetWorkKind([]),
  );

  return workKindList;
};

export const actionGetWorkKind = (payload: any, meta: LoadingMeta): ThunkAction<Promise<WorkKind[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetWorkKind(payload),
    meta,
  );

  return response;
};

export const actionGetAndSetInStoreWorkKind = (payloadOwn: object, meta: LoadingMeta): ThunkAction<Promise<WorkKind[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const workKindList = await dispatch(
    actionGetWorkKind(payloadOwn, meta),
  );

  dispatch(
    actionSetWorkKind(workKindList),
  );

  return workKindList;
};
