import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { Norm } from './@types';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseUpdateNorm, promiseGetNormsByParams, promiseGetNormByIdAndDate } from './promise';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';

export const actionSetSensorType = (normList: IStateSomeUniq['normList']): EtsAction<IStateSomeUniq['normList']> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      normList,
    }),
  );

  return normList;
};
export const actionResetNormList = (): EtsAction<IStateSomeUniq['normList']> => (dispatch) => {
  const normList = dispatch(
    actionSetSensorType([]),
  );

  return normList;
};

export const actionGetNormsByParams = (payload: Parameters<typeof promiseGetNormsByParams>[0], meta: LoadingMeta): EtsAction<Promise<Array<Norm>>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetNormsByParams(payload),
    meta,
  );

  return response;
};

export const actionGetAndSetInStoreNormsByParams = (payload: Parameters<typeof promiseGetNormsByParams>[0], meta: LoadingMeta): EtsAction<Promise<Array<Norm>>> => async (dispatch) => {
  const response = await dispatch(actionGetNormsByParams(payload, meta));

  dispatch(actionSetSensorType(response));

  return response;
};

export const actionUpdateNorm = (normOwn: Norm, meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateNorm(normOwn),
    meta,
  );

  return response;
};

export const actionGetNormByIdAndDate = (payload: Parameters<typeof promiseGetNormByIdAndDate>[0], meta: LoadingMeta): EtsAction<Promise<Norm>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetNormByIdAndDate(payload),
    meta,
  );

  return response;
};
