import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMissionCancelReasons } from 'redux-main/reducers/modules/some_uniq/mission_cancel_reasons/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionSetMissionCancelReasons = (missionCancelReasonsList: IStateSomeUniq['missionCancelReasonsList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      missionCancelReasonsList,
    }),
  )
);

export const actionResetMissionCancelReasons = (): EtsAction<EtsActionReturnType<typeof actionSetMissionCancelReasons>> => (dispatch) => (
  dispatch(
    actionSetMissionCancelReasons([]),
  )
);
export const actionGetMissionCancelReason = (payload: Parameters<typeof promiseGetMissionCancelReasons>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetMissionCancelReasons>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetMissionCancelReasons(payload),
    meta,
  );
};

export const actionGetAndSetInStoreMissionCancelReasons = (...arg: Parameters<typeof actionGetMissionCancelReason>): EtsAction<EtsActionReturnType<typeof actionGetMissionCancelReason>> => async (dispatch) => {
  const result = await dispatch(actionGetMissionCancelReason(...arg));

  dispatch(actionSetMissionCancelReasons(result.data));

  return result;
};
