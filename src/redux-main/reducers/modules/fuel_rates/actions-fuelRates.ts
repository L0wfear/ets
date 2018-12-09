import {
  getFuelOperations,
  getFuelRates,
  getFuelRatesByCarModel,
  getEquipmentFuelRatesByCarModel,
} from 'redux-main/reducers/modules/fuel_rates/promises/index';

import {
  IFuelOperations,
  IFuelRatesByCarModel,
  IEquipmentFuelRatesByCarModel,
 } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
//  import {
//   FUEL_RATES_SET_DATA
// } from 'redux-main/reducers/modules/fuel_rates/fuelRates'
export const FuelRatesGet = (type: string | null) => ({
  type, // for stores switch case
  payload: getFuelRates(),
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
