import { TireSize } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireSize,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_size/promise';

/* ---------- TireSize ---------- */
export const autobaseSetTireSize = (tireSizeList: TireSize[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireSizeList,
    }),
  )
);
export const autobaseResetSetTireSize = () => (dispatch) => (
  dispatch(
    autobaseSetTireSize([]),
  )
);
export const autobaseGetTireSize: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getTireSize(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const tireSizeGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetTireSize(payload, { page, path }),
  );

  dispatch(
    autobaseSetTireSize(data),
  );

  return {
    tireSizeList: data,
  };
};
