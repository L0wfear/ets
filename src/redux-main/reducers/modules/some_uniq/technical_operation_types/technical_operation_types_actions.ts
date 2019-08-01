import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetTechnicalOperationTypes } from 'redux-main/reducers/modules/some_uniq/technical_operation_types/technical_operation_types_promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { TechnicalOperationTypes } from './@types/technical_operation_types';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionSetTechnicalOperationTypes = (technicalOperationTypesList: IStateSomeUniq['technicalOperationTypesList']): EtsAction<IStateSomeUniq['technicalOperationTypesList']> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      technicalOperationTypesList,
    }),
  );

  return technicalOperationTypesList;
};
export const actionResetTechnicalOperationTypes = (): EtsAction<IStateSomeUniq['technicalOperationTypesList']> => (dispatch) => {
  const technicalOperationTypesList = dispatch(
    actionSetTechnicalOperationTypes([]),
  );

  return technicalOperationTypesList;
};

export const actionGetTechnicalOperationTypes = (payload: any, meta: LoadingMeta): EtsAction<Promise<TechnicalOperationTypes[]>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetTechnicalOperationTypes(payload),
    meta,
  );

  return response;
};

export const actionGetAndSetInStoreTechnicalOperationTypes = (payloadOwn: object, meta: LoadingMeta): EtsAction<Promise<TechnicalOperationTypes[]>> => async (dispatch) => {
  const technicalOperationTypesList = await dispatch(
    actionGetTechnicalOperationTypes(payloadOwn, meta),
  );

  dispatch(
    actionSetTechnicalOperationTypes(technicalOperationTypesList),
  );

  return technicalOperationTypesList;
};
