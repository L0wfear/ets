import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographRepairList, TachographRepair } from './@types';
import {
  promiseGetTachographRepairList,
  createSetTachographRepair,
  updateSetTachographRepair,
  autobaseDeleteTachographRepair
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographRepairList = (tachographRepairList: Array<TachographRepairList>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographRepairList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographRepairList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographRepairList>> => (dispatch) => (
  dispatch(
    actionSetTachographRepairList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographRepairList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographRepairList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographRepairList(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographRepairList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographRepairList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographRepairList(payload, meta),
  );

  dispatch(
    actionSetTachographRepairList(result.data),
  );

  return result;
};

export const autobaseCreateTachographRepair = (tachographRepairOld: TachographRepair, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetTachographRepair>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetTachographRepair(tachographRepairOld),
    meta,
  );
};

export const autobaseUpdateTachographRepair = (tachographRepairOld: TachographRepair, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetTachographRepair>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetTachographRepair(tachographRepairOld),
    meta,
  );
};
export const autobaseRemoveTachographRepair = (id: TachographRepair['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteTachographRepair>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteTachographRepair(id),
    meta,
  );
};
