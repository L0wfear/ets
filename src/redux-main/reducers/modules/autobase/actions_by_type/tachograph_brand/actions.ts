import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographBrand } from './@types';
import { 
  promiseGetTachographBrandList
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_brand/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographBrandList = (tachographBrandList: Array<TachographBrand>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographBrandList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographBrandList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographBrandList>> => (dispatch) => (
  dispatch(
    actionSetTachographBrandList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographBrandList = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographBrandList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographBrandList(),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographBrandList = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographBrandList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographBrandList(meta),
  );

  dispatch(
    actionSetTachographBrandList(result.data),
  );

  return result;
};
