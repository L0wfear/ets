import { BatteryAvailableCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getBatteryAvailableCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/battery_available_car/promise';

/* ---------- BatteryAvailableCar ---------- */
export const autobaseSetBatteryAvailableCar = (batteryAvailableCarList: BatteryAvailableCar[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      batteryAvailableCarList,
    }),
  )
);
export const autobaseResetSetBatteryAvailableCar = () => (dispatch) => (
  dispatch(
    autobaseSetBatteryAvailableCar([]),
  )
);
export const autobaseGetBatteryAvailableCar: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getBatteryAvailableCar(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const batteryAvailableCarGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetBatteryAvailableCar(payload, { page, path }),
  );

  dispatch(
    autobaseSetBatteryAvailableCar(data),
  );

  return {
    batteryAvailableCarList: data,
  };
};
