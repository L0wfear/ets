import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { loadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/promise';
import { someUniqSetNewData } from '../common';
import { IStateSomeUniq } from '../@types/some_uniq.h';

export const actionLoadTimeMoscow = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof loadTimeMoscow>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    loadTimeMoscow(payload),
    meta,
  )
);

export const actionSetSpecialMoscowTimeServer = (moscowTimeServer: IStateSomeUniq['moscowTimeServer']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      moscowTimeServer,
    }),
  )
);
export const actionResetMoscowTimeServer = (): EtsAction<EtsActionReturnType<typeof actionSetSpecialMoscowTimeServer>> => (dispatch) => (
  dispatch(
    actionSetSpecialMoscowTimeServer({
      timestamp: null,
      date: '',
    }),
  )
);

export const actionGetAndSetInStoreMoscowTimeServer = (...arg: Parameters<typeof actionLoadTimeMoscow>): EtsAction<EtsActionReturnType<typeof actionLoadTimeMoscow>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadTimeMoscow(...arg),
  );

  dispatch(
    actionSetSpecialMoscowTimeServer(result),
  );

  return result;
};