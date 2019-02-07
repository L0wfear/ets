import { ActualTiresOnCar } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getActualTiresOnCar,
} from 'redux-main/reducers/modules/autobase/actions_by_type/actual_tires_on_car/promise';

/* ---------- ActualTiresOnCar ---------- */
export const autobaseSetActualTiresOnCar = (actualTiresOnCarList: ActualTiresOnCar[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      actualTiresOnCarList,
    }),
  )
);
export const autobaseResetSetActualTiresOnCar = () => (dispatch) => (
  dispatch(
    autobaseSetActualTiresOnCar([]),
  )
);
export const autobaseGetActualTiresOnCar: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getActualTiresOnCar(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const actualTiresOnCarGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetActualTiresOnCar(payload, { page, path }),
  );

  dispatch(
    autobaseSetActualTiresOnCar(data),
  );

  return {
    actualTiresOnCarList: data,
  };
};
