import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetReasonOption } from 'redux-main/reducers/modules/some_uniq/waybill/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionSetReasonOption = (reasonOption: IStateSomeUniq['reasonOption']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      reasonOption,
    }),
  )
);
export const actionResetReasonOption = (): EtsAction<EtsActionReturnType<typeof actionSetReasonOption>> => (dispatch) => (
  dispatch(
    actionSetReasonOption([]),
  )
);

export const actionGetReasonOption = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetReasonOption>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetReasonOption(payload),
    meta,
  )
);

export const actionGetAndSetInStoreReasonOption = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetReasonOption>> => async (dispatch) => {
  const result = await dispatch(
    actionGetReasonOption(payload, meta),
  );

  dispatch(
    actionSetReasonOption(result.data),
  );

  return result;
};
