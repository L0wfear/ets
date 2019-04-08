import {
  getMaterialConsumptionRate,
  createMaterialConsumptionRate,
  updateMaterialConsumptionRate,
  deleteMaterialConsumptionRate,
} from 'redux-main/reducers/modules/material_consumption_rate/promises/index';

import {
  MaterialConsumptionRate,
 } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

import { MAINTENANCE_RATE_SET_DATA } from 'redux-main/reducers/modules/material_consumption_rate/materialConsumptionRate';

export const materialConsumptionRateGet = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getMaterialConsumptionRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export const materialConsumptionRateCreate: any = (payload: MaterialConsumptionRate, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const newMaterialConsumptionRate = await dispatch({
    type: 'none',
    payload: createMaterialConsumptionRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
  await materialConsumptionRateGetAndSetInStore({}, {page, path});
  return newMaterialConsumptionRate;
};

export const materialConsumptionRateSetNewData = (newStateData) => ({
  type: MAINTENANCE_RATE_SET_DATA,
  payload: newStateData,
});

export const materialConsumptionRateGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { materialConsumptionRateList } } = await dispatch(
    materialConsumptionRateGet(payload, { page, path, }),
  );

  dispatch(
    materialConsumptionRateSetNewData({materialConsumptionRateList}),
  );

  return {
    materialConsumptionRateList,
  };
};

export const materialConsumptionRateUpdate: any = (payload: MaterialConsumptionRate, { page, path }: {page: string, path?: string }) => async (dispatch) => {
  const materialConsumptionRateUpd = await dispatch({
    type: 'none',
    payload: updateMaterialConsumptionRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
  await materialConsumptionRateGetAndSetInStore({}, {page, path});
  return materialConsumptionRateUpd;
};

export const materialConsumptionRateDelete = (id: number) => ({
  type: 'none',
  payload: deleteMaterialConsumptionRate(id),
  meta: {
    promise: true,
  },
});
