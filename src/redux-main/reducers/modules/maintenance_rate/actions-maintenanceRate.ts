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

export const maintenanceRateGet = (type: string | null, payload) => ({
  type: type || MAINTENANCE_RATE_SET_DATA, // Заменить на none
  payload: getMaintenanceRate(payload),
  meta: {
    promise: true,
  },
});

export const maintenanceRateCreate = (type: string | null, mrType: string, formstate: ICreateMaintenanceRate) => ({
  type: type || MAINTENANCE_RATE_SET_DATA, // Заменить на none
  payload: createMaintenanceRate(mrType, formstate),
  meta: {
    promise: true,
  },
});

export const maintenanceRateUpdate = (type: string | null, mrType: string, formstate: IMaintenanceRateUpd) => ({
  type: type || MAINTENANCE_RATE_SET_DATA, // Заменить на none
  payload: updateMaintenanceRate(mrType, formstate),
  meta: {
    promise: true,
  },
});

export const maintenanceRateDelete = (type: string | null, id: number) => ({
  type: type || MAINTENANCE_RATE_SET_DATA, // Заменить на none
  payload: deleteMaintenanceRate(id),
  meta: {
    promise: true,
  },
});
