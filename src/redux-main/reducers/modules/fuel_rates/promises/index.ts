import { createValidDate } from 'components/@next/@utils/dates/dates';
import {
  FuelConsumptionRateService,
  FuelOperationsService,
} from 'api/Services';
import {
  FuelRate,
} from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { FuelOperation } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

export const getFuelRates = (payload = {}): Promise<{ fuelRatesList: Array<FuelRate>;}> => {
  return FuelConsumptionRateService.get(payload)
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

type IFuelRatesByCarModel = {
  car_id?: number | null;
  datetime?: string | null;
  for_equipment?: number | null;
  company_structure_id?: number | null;
};
export const getFuelRatesByCarModel = (payload: IFuelRatesByCarModel = {} ) => {
  return getFuelRates(payload);
};

export const getEquipmentFuelRatesByCarModel = (payload: IFuelRatesByCarModel) => {
  return getFuelRatesByCarModel({
    ...payload,
    for_equipment: 'for_equipment' in payload ? payload.for_equipment : 1,
  });
};

export const createFuelRate = (rate: FuelRate) => {
  const {
    car_model_name,
    car_special_model_name,
    ...payload
  } = rate;
  payload.order_date = createValidDate(payload.order_date);

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

export const getFuelOperations = (payload = {}): Promise<{ fuelRateOperations: Array<FuelOperation>; }> => {
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
