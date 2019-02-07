import { ActualBatteriesOnCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getActualBatteriesOnCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/actual_batteries_on_car/promise';

/* ---------- ActualBatteriesOnCar ---------- */
export const autobaseSetActualBatteriesOnCar = (actualBatteriesOnCarList: ActualBatteriesOnCar[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      actualBatteriesOnCarList,
    }),
  )
);
export const autobaseResetSetActualBatteriesOnCar = () => (dispatch) => (
  dispatch(
    autobaseSetActualBatteriesOnCar([]),
  )
);
export const autobaseGetActualBatteriesOnCar: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getActualBatteriesOnCar(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actualBatteriesOnCarGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetActualBatteriesOnCar(payload, { page, path }),
  );

  dispatch(
    autobaseSetActualBatteriesOnCar(data),
  );

  return {
    actualBatteriesOnCarList: data,
  };
};
