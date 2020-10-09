import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographRepairReasonList } from './@types';
import {
  promiseGetTachographRepairReasonList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair_reason_list/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographRepairReasonList = (tachographRepairReasonList: Array<TachographRepairReasonList>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographRepairReasonList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographRepairReasonList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographRepairReasonList>> => (dispatch) => (
  dispatch(
    actionSetTachographRepairReasonList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographRepairReasonList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographRepairReasonList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographRepairReasonList(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographRepairReasonList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographRepairReasonList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographRepairReasonList(payload, meta),
  );

  dispatch(
    actionSetTachographRepairReasonList(result.data),
  );

  return result;
};
