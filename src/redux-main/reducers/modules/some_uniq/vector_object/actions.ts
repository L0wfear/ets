import { getVectorObject } from 'redux-main/reducers/modules/some_uniq/vector_object/promise';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionGetVectorObject = (payload: Parameters<typeof getVectorObject>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof getVectorObject>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getVectorObject(payload),
    meta,
  );
};
