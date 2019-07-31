import { promiseGetCleaningOneNorm } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/promise';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const actionLoadCleaningOneNorm = (payloadOwn: any, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetCleaningOneNorm>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetCleaningOneNorm(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export default {
  actionLoadCleaningOneNorm,
};
