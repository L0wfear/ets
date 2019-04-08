import {
  getMaintenanceRate,
  createMaintenanceRate,
  updateMaintenanceRate,
  deleteMaintenanceRate,
} from 'redux-main/reducers/modules/maintenance_rate/promises/index';

import {
  MaintenanceRate,
 } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

import { MAINTENANCE_RATE_SET_DATA } from 'redux-main/reducers/modules/maintenance_rate/maintenanceRate';

export const maintenanceRateGet = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getMaintenanceRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export const maintenanceRateCreate: any = (payload: MaintenanceRate, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const newMaintenanceRate = await dispatch({
    type: 'none',
    payload: createMaintenanceRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
  await maintenanceRateGetAndSetInStore({}, {page, path});
  return newMaintenanceRate;
};

export const maintenanceRateSetNewData = (newStateData) => ({
  type: MAINTENANCE_RATE_SET_DATA,
  payload: newStateData,
});

export const maintenanceRateGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { maintenanceRateList } } = await dispatch(
    maintenanceRateGet(payload, { page, path, }),
  );

  dispatch(
    maintenanceRateSetNewData({maintenanceRateList}),
  );

  return {
    maintenanceRateList,
  };
};

export const maintenanceRateUpdate: any = (payload: MaintenanceRate, { page, path }: {page: string, path?: string }) => async (dispatch) => {
  const maintenanceRateUpd = await dispatch({
    type: 'none',
    payload: updateMaintenanceRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
  await maintenanceRateGetAndSetInStore({}, {page, path});
  return maintenanceRateUpd;
};

export const maintenanceRateDelete = (id: number) => ({
  type: 'none',
  payload: deleteMaintenanceRate(id),
  meta: {
    promise: true,
  },
});
