import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { Penalty } from './@types';
import { promiseGetPenaltyList } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetPenaltyList = (penaltyList: Array<Penalty>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      penaltyList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetPenaltyList = (): EtsAction<EtsActionReturnType<typeof actionSetPenaltyList>> => (dispatch) => (
  dispatch(
    actionSetPenaltyList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetPenaltyList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetPenaltyList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetPenaltyList(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStorePenaltyList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetPenaltyList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetPenaltyList(payload, meta),
  );

  dispatch(
    actionSetPenaltyList(result.data),
  );

  return result;
};
