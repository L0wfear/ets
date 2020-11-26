import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographReplacementSkziList, TachographReplacementSkziPayload } from './@types';
import { 
  promiseChangeTachographReplacementSkziList,
  promiseGetTachographReplacementSkziList
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_replacement_skzi/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographReplacementSkziList = (tachographReplacementSkziList: Array<TachographReplacementSkziList>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographReplacementSkziList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographReplacementSkziList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographReplacementSkziList>> => (dispatch) => (
  dispatch(
    actionSetTachographReplacementSkziList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographReplacementSkziList = (payload: {tachograph_id: number;}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographReplacementSkziList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographReplacementSkziList(payload),
    meta,
  )
);

export const actionChangeTachographReplacementSkziList = (
  payload: TachographReplacementSkziPayload,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseChangeTachographReplacementSkziList>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseChangeTachographReplacementSkziList(payload), meta);
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographReplacementSkziList = (payload: {tachograph_id: number;}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographReplacementSkziList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographReplacementSkziList(payload, meta),
  );

  dispatch(
    actionSetTachographReplacementSkziList(result.data),
  );

  return result;
};
