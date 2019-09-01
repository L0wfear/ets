import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const defaultAction = <F extends any>(promise: Promise<F>, meta: LoadingMeta): EtsAction<Promise<F>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promise,
    meta,
  )
);
