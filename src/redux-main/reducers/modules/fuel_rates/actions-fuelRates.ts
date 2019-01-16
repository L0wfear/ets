import {
  getFuelRates,
  getFuelRatesByCarModel,
  getEquipmentFuelRatesByCarModel,
  createFuelRate,
  updateFuelRate,
  deleteFuelRate,
  getFuelOperationsIsActive,
  getFuelOperations,
  createFuelOperation,
  updateFuelOperation,
  deleteFuelOperation,
} from 'redux-main/reducers/modules/fuel_rates/promises/index';

import {
  IFuelOperations,
  IFuelRatesByCarModel,
  IEquipmentFuelRatesByCarModel,
  ICreateFuel,
  FuelRateUpd,
 } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';

import { FUEL_RATES_SET_DATA } from 'redux-main/reducers/modules/fuel_rates/fuelRates';

export const FuelRatesGet = (type: string | null) => ({
  type: type || FUEL_RATES_SET_DATA, // for stores switch case
  payload: getFuelRates(),
  meta: {
    promise: true,
  },
});

export const FuelRatesByCarModelGet = (type: string | null, payload: IFuelRatesByCarModel) => ({
  type,
  payload: getFuelRatesByCarModel(payload),
  meta: {
    promise: true,
  },
});

export const EquipmentFuelRatesByCarModelGet = (type: string | null, payload: IEquipmentFuelRatesByCarModel) => ({
  type,
  payload: getEquipmentFuelRatesByCarModel(payload),
  meta: {
    promise: true,
  },
});

export const FuelRateCreate = (type: string | null, payload: ICreateFuel) => ({
  type,
  payload: createFuelRate(payload),
  meta: {
    promise: true,
  },
});

export const FuelRateUpdate = (type: string | null, payload: FuelRateUpd) => ({
  type,
  payload: updateFuelRate(payload),
  meta: {
    promise: true,
  },
});

export const FuelRateDelete = (type: string | null, payload: number) => ({
  type,
  payload: deleteFuelRate(payload),
  meta: {
    promise: true,
  },
});

export const FuelOperationsGet = (type: string | null, payload: IFuelOperations) => ({
  type,
  payload: getFuelOperations(payload),
  meta: {
    promise: true,
  },
});

export const FuelOperationsIsActiveGet = (type: string | null, payload?: IFuelOperations) => ({
  type,
  payload: getFuelOperationsIsActive(payload),
  meta: {
    promise: true,
  },
});

export const FuelOperationCreate = (type: string | null, payload) => ({
  type,
  payload: createFuelOperation(payload),
  meta: {
    promise: true,
  },
});

export const FuelOperationUpdate = (type: string | null, payload) => ({
  type,
  payload: updateFuelOperation(payload),
  meta: {
    promise: true,
  },
});

export const FuelOperationDelete = (type: string | null, payload) => ({
  type,
  payload: deleteFuelOperation(payload),
  meta: {
    promise: true,
  },
});
