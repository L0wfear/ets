// import { get } from 'lodash';
// import { Actions } from 'flummox';
import { createValidDate } from 'utils/dates';
import { clone, mapKeys } from 'lodash';
import {
  FuelConsumptionRateService,
  FuelOperationsService,
} from 'api/Services';
import {
  IFuelOperations,
  IFuelRatesByCarModel,
  IEquipmentFuelRatesByCarModel,
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
    }).then((r) => ({ result: r.result.rows }));
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
  }).then((r) => ({ result: r.result.rows }));
};

export const getFuelRatesByCarModel = (payload: IFuelRatesByCarModel = {} ) => {
  return getFuelRates(payload);
};

export const getEquipmentFuelRatesByCarModel = (payload: IEquipmentFuelRatesByCarModel) => {
  return getFuelRates(payload);
};

// export const createFuelRate = (rate) => {
//   const payload = { ...rate };
//   delete payload.car_model_name;
//   delete payload.car_special_model_name;

//   payload.order_date = createValidDate(payload.order_date);

//   mapKeys(payload, (v, k) => {
//     if (isEmpty(v)) {
//       payload[k] = 'null';
//     }
//   });

//   return FuelConsumptionRateService.post(payload, getFuelRates, 'json');
// };

// export const updateFuelRate(newFuelRate) {
//   const payload = { ...newFuelRate };
//   delete payload.rate_on_date;
//   delete payload.season;
//   delete payload.car_model_name;
//   delete payload.car_special_model_name;

//   payload.order_date = createValidDate(payload.order_date);

//   return FuelConsumptionRateService.put(payload, getFuelRates, 'json');
// }

// export const deleteFuelRate(id) {
//   const payload = {
//     id,
//   };
//   return FuelConsumptionRateService.delete(payload, getFuelRates, 'json');
// }

// export const getFuelOperations(payload) {
//   return getFuelOperations(payload);
// }

// export const createFuelOperation(formState) {
//   const payload = {};
//   if (typeof formState.name === 'string' && formState.name !== '') {
//     payload.name = formState.name;
//     payload.equipment = !!formState.equipment;
//     payload.measure_unit_id = formState.measure_unit_id;
//     payload.is_excluding_mileage = !!formState.is_excluding_mileage;
//   }

//   return FuelOperationsService.post(payload, getFuelOperations, 'json');
// }

// export const updateFuelOperation(formState) {
//   const payload = {
//     id: formState.id,
//   };
//   if (typeof formState.name === 'string' && formState.name !== '') {
//     payload.name = formState.name;
//     payload.equipment = !!formState.equipment;
//     payload.measure_unit_id = formState.measure_unit_id;
//     payload.is_excluding_mileage = !!formState.is_excluding_mileage;
//   }
//   return FuelOperationsService.put(payload, getFuelOperations, 'json');
// }

// export const deleteFuelOperation(id) {
//   const payload = {
//     id,
//   };
//   return FuelOperationsService.delete(payload, getFuelOperations, 'json');
// }
