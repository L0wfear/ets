import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTechnicalOperationObjects } from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/technical_operation_objects_promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { TechnicalOperationObjects } from './@types/technical_operation_objects';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionSetTechnicalOperationObjects = (technicalOperationObjectsList: IStateSomeUniq['technicalOperationObjectsList']): EtsAction<IStateSomeUniq['technicalOperationObjectsList']> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      technicalOperationObjectsList,
    }),
  );

  return technicalOperationObjectsList;
};
export const actionResetTechnicalOperationObjects = (): EtsAction<IStateSomeUniq['technicalOperationObjectsList']> => (dispatch) => {
  const technicalOperationObjectsList = dispatch(
    actionSetTechnicalOperationObjects([]),
  );

  return technicalOperationObjectsList;
};

export const actionGetTechnicalOperationObjects = (payload: any, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetTechnicalOperationObjects>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetTechnicalOperationObjects(payload),
    meta,
  );

  return response;
};

export const actionGetAndSetInStoreTechnicalOperationObjects = (payloadOwn: object, meta: LoadingMeta): EtsAction<Promise<TechnicalOperationObjects[]>> => async (dispatch) => {
  const technicalOperationObjectsList = await dispatch(
    actionGetTechnicalOperationObjects(payloadOwn, meta),
  );

  dispatch(
    actionSetTechnicalOperationObjects(technicalOperationObjectsList),
  );

  return technicalOperationObjectsList;
};
