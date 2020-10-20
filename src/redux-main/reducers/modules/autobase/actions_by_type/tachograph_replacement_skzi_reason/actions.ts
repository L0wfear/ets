import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographReplacementSkziReason } from './@types';
import { 
  promiseGetTachographReplacementSkziReasonList
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_replacement_skzi_reason/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographReplacementSkziReasonList = (tachographReplacementSkziReasonList: Array<TachographReplacementSkziReason>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographReplacementSkziReasonList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographReplacementSkziReasonList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographReplacementSkziReasonList>> => (dispatch) => (
  dispatch(
    actionSetTachographReplacementSkziReasonList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographReplacementSkziReasonList = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographReplacementSkziReasonList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographReplacementSkziReasonList(),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographReplacementSkziReasonList = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographReplacementSkziReasonList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographReplacementSkziReasonList(meta),
  );

  dispatch(
    actionSetTachographReplacementSkziReasonList(result.data),
  );

  return result;
};
