import { CarCategory } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  createSetCarCategory,
  updateSetCarCategory,
  autobaseDeleteCarCategory,
} from 'redux-main/reducers/modules/autobase/actions_by_type/car_category/promise';

/* ---------- CarCategory ---------- */
export const autobaseSetCarCategory = (carCategoryList: CarCategory[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      carCategoryList,
    }),
  )
);
export const autobaseResetSetCarCategory = () => (dispatch) => (
  dispatch(
    autobaseSetCarCategory([]),
  )
);
export const autobaseCreateCarCategory: any = (carCategoryOld: CarCategory, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: carCategory } = await dispatch({
    type: 'none',
    payload: createSetCarCategory(carCategoryOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return carCategory;
};
export const autobaseUpdateCarCategory: any = (carCategoryOld: CarCategory, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: carCategory } = await dispatch({
    type: 'none',
    payload: updateSetCarCategory(carCategoryOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return carCategory;
};
export const autobaseRemoveCarCategory = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteCarCategory(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
