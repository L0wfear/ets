
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseGetTrackInfo } from 'redux-main/reducers/modules/some_uniq/track/promise';

export const actionGetTrackInfo = (payload: Parameters<typeof promiseGetTrackInfo>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTrackInfo>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTrackInfo(payload),
    meta,
  )
);
