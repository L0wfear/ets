import { CleaningRate } from './@types/cleaningRate';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseCreateCleaningRate, promiseUpdateCleaningRate } from './promise_cleaning_rate';

export const actionCreateCleaningRate = (cleaningRateNew: CleaningRate, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateCleaningRate>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateCleaningRate(cleaningRateNew),
    meta,
  );

  return response;
};

export const actionUpdateCleaningRate = (cleaningRateNew: CleaningRate, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateCleaningRate>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCleaningRate(cleaningRateNew),
    meta,
  );

  return response;
};
