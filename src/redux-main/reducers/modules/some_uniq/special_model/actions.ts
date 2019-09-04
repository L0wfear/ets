import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetSpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionSetSpecialModel = (specialModelList: IStateSomeUniq['specialModelList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      specialModelList,
    }),
  )
);
export const actionResetSpecialModel = (): EtsAction<EtsActionReturnType<typeof actionSetSpecialModel>> => (dispatch) => (
  dispatch(
    actionSetSpecialModel([]),
  )
);
export const actionLoadSpecialModel = (payload: Parameters<typeof promiseGetSpecialModel>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionLoadSpecialModel>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetSpecialModel(payload),
    meta,
  )
);

export const actionGetAndSetInStoreSpecialModel = (...arg: Parameters<typeof actionLoadSpecialModel>): EtsAction<EtsActionReturnType<typeof actionLoadSpecialModel>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadSpecialModel(...arg),
  );

  dispatch(
    actionSetSpecialModel(result.data),
  );

  return result;
};
