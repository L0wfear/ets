import { CarCategory } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  createSetCarCategory,
  updateSetCarCategory,
  autobaseDeleteCarCategory,
} from 'redux-main/reducers/modules/autobase/actions_by_type/car_category/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- CarCategory ---------- */
export const autobaseSetCarCategory = (carCategoryList: CarCategory[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      carCategoryList,
    }),
  )
);
export const autobaseResetSetCarCategory = (): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetCarCategory([]),
  )
);
export const autobaseCreateCarCategory = (carCategoryOld: CarCategory, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetCarCategory>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetCarCategory(carCategoryOld),
    meta,
  );
};
export const autobaseUpdateCarCategory = (carCategoryOld: CarCategory, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetCarCategory>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetCarCategory(carCategoryOld),
    meta,
  );
};
export const autobaseRemoveCarCategory = (id, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteCarCategory>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteCarCategory(id),
    meta,
  );
};
