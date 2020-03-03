import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetModelList } from 'redux-main/reducers/modules/some_uniq/modelList/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionSetModelList = (modelsList: IStateSomeUniq['modelsList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      modelsList,
    }),
  )
);
export const actionResetModelList = (): EtsAction<EtsActionReturnType<typeof actionSetModelList>> => (dispatch) => (
  dispatch(
    actionSetModelList([]),
  )
);

export const actionGetModelList = (payload: Parameters<typeof promiseGetModelList>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetModelList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetModelList(payload),
    meta,
  )
);

export const actionGetAndSetInStoreModelList = (...arg: Parameters<typeof actionGetModelList>): EtsAction<EtsActionReturnType<typeof actionGetModelList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetModelList(...arg),
  );

  dispatch(
    actionSetModelList(result.data),
  );

  return result;
};
