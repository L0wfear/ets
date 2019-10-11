import { promiseGetCleaningOneNorm } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/promise';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionLoadCleaningOneNorm = (payload: Parameters<typeof promiseGetCleaningOneNorm>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetCleaningOneNorm>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetCleaningOneNorm(payload),
    meta,
  );
};
