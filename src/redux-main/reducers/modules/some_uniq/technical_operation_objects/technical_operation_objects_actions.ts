import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTechnicalOperationObjects } from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/technical_operation_objects_promise';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { TechnicalOperationObjects } from './@types/technical_operation_objects';

export const actionSetTechnicalOperationObjects = (technicalOperationObjectsList: IStateSomeUniq['technicalOperationObjectsList']): ThunkAction<IStateSomeUniq['technicalOperationObjectsList'], ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      technicalOperationObjectsList,
    }),
  );

  return technicalOperationObjectsList;
};
export const actionResetTechnicalOperationObjects = (): ThunkAction<IStateSomeUniq['technicalOperationObjectsList'], ReduxState, {}, AnyAction> => (dispatch) => {
  const technicalOperationObjectsList = dispatch(
    actionSetTechnicalOperationObjects([]),
  );

  return technicalOperationObjectsList;
};

export const actionGetTechnicalOperationObjects = (payload: any, meta: LoadingMeta): ThunkAction<Promise<TechnicalOperationObjects[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetTechnicalOperationObjects(payload),
    meta,
  );

  return response;
};

export const actionGetAndSetInStoreTechnicalOperationObjects = (payloadOwn: object, meta: LoadingMeta): ThunkAction<Promise<TechnicalOperationObjects[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const technicalOperationObjectsList = await dispatch(
    actionGetTechnicalOperationObjects(payloadOwn, meta),
  );

  dispatch(
    actionSetTechnicalOperationObjects(technicalOperationObjectsList),
  );

  return technicalOperationObjectsList;
};
