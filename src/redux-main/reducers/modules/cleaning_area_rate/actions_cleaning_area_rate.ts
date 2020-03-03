import { CleaningAreaRate } from './@types/cleaningAreaRate';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseCreateCleaningAreaRate, promiseUpdateCleaningAreaRate } from './promise_cleaning_area_rate';

export const actionCreateCleaningAreaRate = (cleaningAreaRateNew: CleaningAreaRate, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateCleaningAreaRate>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateCleaningAreaRate(cleaningAreaRateNew),
    meta,
  );

  return response;
};

export const actionUpdateCleaningAreaRate = (cleaningAreaRateNew: CleaningAreaRate, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateCleaningAreaRate>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateCleaningAreaRate(cleaningAreaRateNew),
    meta,
  );

  return response;
};
