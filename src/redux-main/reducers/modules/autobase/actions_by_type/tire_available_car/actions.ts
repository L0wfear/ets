import { TireAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireAvailableCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_available_car/promise';

/* ---------- TireAvailableCar ---------- */
export const autobaseSetTireAvailableCar = (tireAvailableCarList: TireAvailableCar[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireAvailableCarList,
    }),
  )
);
export const autobaseResetSetTireAvailableCar = () => (dispatch) => (
  dispatch(
    autobaseSetTireAvailableCar([]),
  )
);
export const autobaseGetTireAvailableCar: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getTireAvailableCar(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const tireAvailableCarGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetTireAvailableCar(payload, { page, path }),
  );

  dispatch(
    autobaseSetTireAvailableCar(data),
  );

  return {
    tireAvailableCarList: data,
  };
};
