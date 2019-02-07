import { TireManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireManufacturer,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_manufacturer/promise';

/* ---------- TireManufacturer ---------- */
export const autobaseSetTireManufacturer = (tireManufacturerList: TireManufacturer[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireManufacturerList,
    }),
  )
);
export const autobaseResetSetTireManufacturer = () => (dispatch) => (
  dispatch(
    autobaseSetTireManufacturer([]),
  )
);
export const autobaseGetTireManufacturer: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getTireManufacturer(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const tireManufacturerGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetTireManufacturer(payload, { page, path }),
  );

  dispatch(
    autobaseSetTireManufacturer(data),
  );

  return {
    tireManufacturerList: data,
  };
};
