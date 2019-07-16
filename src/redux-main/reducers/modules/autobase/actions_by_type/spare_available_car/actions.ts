import { SpareAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSpareAvailableCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/spare_available_car/promise';

/* ---------- SpareAvailableCar ---------- */
export const autobaseSetSpareAvailableCar = (spareAvailableCarList: SpareAvailableCar[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      spareAvailableCarList,
    }),
  )
);
export const autobaseResetSetSpareAvailableCar = () => (dispatch) => (
  dispatch(
    autobaseSetSpareAvailableCar([]),
  )
);
export const autobaseGetSpareAvailableCar: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSpareAvailableCar(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const spareAvailableCarGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSpareAvailableCar(payload, { page, path }),
  );

  dispatch(
    autobaseSetSpareAvailableCar(data),
  );

  return {
    spareAvailableCarList: data,
  };
};
