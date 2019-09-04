import { createValidDate } from 'components/@next/@utils/dates/dates';
import { mapKeys } from 'lodash';
import {
  FuelConsumptionRateService,
  FuelOperationsService,
} from 'api/Services';
import {
  IFuelRatesByCarModel,
  IEquipmentFuelRatesByCarModel,
  FuelRate,
 } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { isEmpty } from 'utils/functions';
import { FuelOperation } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

export const getFuelRates = (payload = {}): Promise<{ fuelRatesList: FuelRate[]}> => {
  return FuelConsumptionRateService
  .get(payload)
  .catch((error) => {
    // tslint:disable-next-line:no-console
    console.warn(error);

    return {
      result: {
        rows: [],
      },
    };
  }).then((r) => ({ fuelRatesList: r.result.rows }));
};

export const getFuelRatesByCarModel = (payload: IFuelRatesByCarModel = {} ) => {
  return getFuelRates(payload);
};

export const getEquipmentFuelRatesByCarModel = (payload: IEquipmentFuelRatesByCarModel) => {
  return getFuelRates(payload);
};

export const createFuelRate = (rate: FuelRate) => {
  const {
    car_model_name,
    car_special_model_name,
    ...payload
  } = rate;
  payload.order_date = createValidDate(payload.order_date);

  mapKeys(payload, (v, k) => {
    if (isEmpty(v)) {
      payload[k] = 'null';
    }
    return null;
  });

  return FuelConsumptionRateService.post(
    payload,
    getFuelRates,
    'json',
  );
};

export const updateFuelRate = (newFuelRate: FuelRate) => {
  const {
    car_model_name,
    car_special_model_name,
    ...payload
  } = newFuelRate;
  payload.order_date = createValidDate(payload.order_date);

  return FuelConsumptionRateService.put(
    payload,
    getFuelRates,
    'json',
  );
};

export const deleteFuelRate = ( id: number ) => {
  const payload = {
    id,
  };
  return FuelConsumptionRateService.delete(
    payload,
    getFuelRates,
    'json',
  );
};

export const getFuelOperations = (payload = {}): Promise<{ fuelRateOperations: FuelOperation[] }> => {
  return FuelOperationsService
    .get(payload)
    .catch((error) => {
      // tslint:disable-next-line:no-console
      console.warn(error);

      return {
        result: {
          rows: [],
        },
      };
    }).then((r) => ({ fuelRateOperations: r.result.rows }));
};
