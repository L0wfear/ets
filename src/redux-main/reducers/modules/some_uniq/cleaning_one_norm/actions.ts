import { promiseGetCleaningOneNorm } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/promise';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

const actionLoadCleaningOneNorm = (payloadOwn: any, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetCleaningOneNorm>, ReduxState, {}, AnyAction> => async (dispatch) => {
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
