import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { loadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/promise';

export const actionLoadTimeMoscow = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof loadTimeMoscow>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    loadTimeMoscow(payload),
    meta,
  )
);
