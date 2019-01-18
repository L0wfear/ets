import {
  getMaintenanceRate,
  createMaintenanceRate,
  updateMaintenanceRate,
  deleteMaintenanceRate,
} from 'redux-main/reducers/modules/maintenance_rate/promises/index';

import {
  ICreateMaintenanceRate,
  IMaintenanceRateUpd,
 } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

import { MAINTENANCE_RATE_SET_DATA } from 'redux-main/reducers/modules/maintenance_rate/maintenanceRate';

export const MaintenanceRateGet = (type: string | null, payload) => ({
  type: type || MAINTENANCE_RATE_SET_DATA,
  payload: getMaintenanceRate(payload),
  meta: {
    promise: true,
  },
});

export const MaintenanceRateCreate = (type: string | null, mrType: string, formstate: ICreateMaintenanceRate) => ({
  type: type || MAINTENANCE_RATE_SET_DATA,
  payload: createMaintenanceRate(mrType, formstate),
  meta: {
    promise: true,
  },
});

export const MaintenanceRateUpdate = (type: string | null, mrType: string, formstate: IMaintenanceRateUpd) => ({
  type: type || MAINTENANCE_RATE_SET_DATA,
  payload: updateMaintenanceRate(mrType, formstate),
  meta: {
    promise: true,
  },
});

export const MaintenanceRateDelete = (type: string | null, mrType: string, id: number) => ({
  type: type || MAINTENANCE_RATE_SET_DATA,
  payload: deleteMaintenanceRate(mrType, id),
  meta: {
    promise: true,
  },
});
