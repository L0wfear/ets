import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { RefillType } from './@types/refillType';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseLoadRefillType } from './promise_refill_type';

import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

/* --------------- обновление стора --------------- */
export const actionSetCleanCategories = (
  refillTypeList: IStateSomeUniq['refillTypeList'],
) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      refillTypeList,
    }),
  )
);

export const actionResetRefillTypeAndSetInStore = (): EtsAction<Promise<Array<RefillType>>> => async (dispatch) => {
  const result = [];

  dispatch(
    actionSetCleanCategories([]),
  );

  return result;
};

export const actionLoadRefillType = (payload: any, meta: LoadingMeta): EtsAction<Promise<Array<RefillType>>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseLoadRefillType(payload),
    meta,
  );

  return result;
};

export const actionLoadRefillTypeAndSetInStore = (payload: any, meta: LoadingMeta): EtsAction<Promise<Array<RefillType>>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadRefillType(
      payload,
      meta,
    ),
  );

  dispatch(
    actionSetCleanCategories(result),
  );

  return result;
};
