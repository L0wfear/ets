import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographDataReadingList } from './@types';
import { 
  promiseChangeTachographDataReadingList,
  promiseGetTachographDataReadingList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_data_reading/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographDataReadingList = (tachographDataReadingList: Array<TachographDataReadingList>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographDataReadingList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographDataReadingList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographDataReadingList>> => (dispatch) => (
  dispatch(
    actionSetTachographDataReadingList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographDataReadingList = (payload: {tachograph_id: number;}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographDataReadingList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographDataReadingList(payload),
    meta,
  )
);

export const actionChangeTachographDataReadingList = (
  payload: {tachograph_id: number; data_reading: Array<TachographDataReadingList>;},
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseChangeTachographDataReadingList>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseChangeTachographDataReadingList(payload), meta);
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographDataReadingList = (payload: {tachograph_id: number;}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographDataReadingList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographDataReadingList(payload, meta),
  );

  dispatch(
    actionSetTachographDataReadingList(result.data),
  );

  return result;
};
