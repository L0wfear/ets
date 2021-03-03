import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { promiseGetOkrugs } from 'redux-main/reducers/modules/some_uniq/okrugs/promise';
import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export const actionLoadOkrugs = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetOkrugs>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetOkrugs(payload),
    meta,
  )
);

export const actionSetOkrugs = (okrugsList: IStateSomeUniq['okrugsList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      okrugsList,
    }),
  )
);
export const actionResetOkrugs = (): EtsAction<EtsActionReturnType<typeof actionSetOkrugs>> => (dispatch) => (
  dispatch(
    actionSetOkrugs([]),
  )
);

export const actionGetAndSetInStoreOkrugs = (...arg: Parameters<typeof actionLoadOkrugs>): EtsAction<EtsActionReturnType<typeof actionLoadOkrugs>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadOkrugs(...arg),
  );

  dispatch(
    actionSetOkrugs(result),
  );

  return result;
};