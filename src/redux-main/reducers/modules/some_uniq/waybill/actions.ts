import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetSelectedMissions } from 'redux-main/reducers/modules/some_uniq/waybill/promise';

/* --------------- запрос --------------- */
export const actionGetSelectedMissions = (payload: Parameters<typeof promiseGetSelectedMissions>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetSelectedMissions>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetSelectedMissions(payload),
    meta,
  )
);

/* --------------- обновление стора --------------- */
export const actionSetSelectedMissions = (selectedMissionsList: IStateSomeUniq['selectedMissionsList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      selectedMissionsList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetSelectedMissions = (): EtsAction<EtsActionReturnType<typeof actionSetSelectedMissions>> => (dispatch) => (
  dispatch(
    actionSetSelectedMissions([]),
  )
);

export const actionGetAndSetInStoreSelectedMissions = (payload: Parameters<typeof promiseGetSelectedMissions>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetSelectedMissions>> => async (dispatch) => {
  const result = await dispatch(
    actionGetSelectedMissions(payload, meta),
  );

  dispatch(
    actionSetSelectedMissions(result),
  );

  return result;
};
