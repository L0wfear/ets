// import { get } from 'lodash';
// import { Actions } from 'flummox';
import { createValidDate } from 'utils/dates';
import { mapKeys } from 'lodash';
import {
  FuelConsumptionRateService,
  FuelOperationsService,
} from 'api/Services';
import {
  IFuelOperations,
  IFuelRatesByCarModel,
  IEquipmentFuelRatesByCarModel,
  ICreateFuel,
  FuelRateUpd,
  fuelOperation,
 } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { isEmpty } from 'utils/functions';

export const getFuelOperations = (payload: IFuelOperations = {}) => {
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

export const getFuelRates = (payload = {}) => {
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

export const createFuelRate = (rate: ICreateFuel) => {
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

export const updateFuelRate = (newFuelRate: FuelRateUpd) => {
  const {
    rate_on_date,
    season,
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

// export const getFuelOperations(payload) {
//   return getFuelOperations(payload);
// }

export const createFuelOperation = ( formState ) => {
  const payload: fuelOperation = {};

  if (typeof formState.name === 'string' && formState.name !== '') {
    payload.name = formState.name;
    payload.equipment = !!formState.equipment;
    payload.measure_unit_id = formState.measure_unit_id;
    payload.is_excluding_mileage = !!formState.is_excluding_mileage;
  }

  return FuelOperationsService.post(payload, getFuelOperations, 'json');
};

export const updateFuelOperation = (formState) => {
  const payload: fuelOperation = {
    id: formState.id,
  };
  if (typeof formState.name === 'string' && formState.name !== '') {
    payload.name = formState.name;
    payload.equipment = !!formState.equipment;
    payload.measure_unit_id = formState.measure_unit_id;
    payload.is_excluding_mileage = !!formState.is_excluding_mileage;
  }
  return FuelOperationsService.put(payload, getFuelOperations, 'json');
};

export const deleteFuelOperation = (id: number) => {
  const payload = {
    id,
  };
  return FuelOperationsService.delete(payload, getFuelOperations, 'json');
};
