import { Actions } from 'flummox';
import { createValidDate } from 'utils/dates';
import { clone, mapKeys } from 'lodash';
import {
  FuelConsumptionRateService,
  FuelOperationsService,
} from 'api/Services';
import { isEmpty } from 'utils/functions';

function getFuelOperations(payload = {}) {
  return FuelOperationsService.get(payload).then(r => ({ result: r.result.rows }));
}

function getFuelRates(payload = {}) {
  return FuelConsumptionRateService.get(payload).then(r => ({ result: r.result.rows }));
}

export default class FuelRateActions extends Actions {

  getFuelRates() {
    return getFuelRates();
  }

  getFuelRatesByCarModel({ car_id, datetime }) {
    const payload = {
      car_id,
    };
    if (datetime) {
      payload.datetime = datetime;
    }
    return getFuelRates(payload);
  }

  getEquipmentFuelRatesByCarModel({ car_id, datetime }) {
    const payload = {
      car_id,
      for_equipment: 1,
    };
    if (datetime) {
      payload.datetime = datetime;
    }
    return getFuelRates(payload);
  }

  createFuelRate(rate) {
    const payload = clone(rate);
    delete payload.car_model_name;
    delete payload.car_special_model_name;

    payload.order_date = createValidDate(payload.order_date);

    mapKeys(payload, (v, k) => {
      if (isEmpty(v)) {
        payload[k] = 'null';
      }
    });

    return FuelConsumptionRateService.post(payload, getFuelRates, 'json');
  }

  updateFuelRate(newFuelRate) {
    const payload = { ...newFuelRate };
    delete payload.rate_on_date;
    delete payload.season;
    delete payload.car_model_name;
    delete payload.car_special_model_name;

    payload.order_date = createValidDate(payload.order_date);

    return FuelConsumptionRateService.put(payload, getFuelRates, 'json');
  }

  deleteFuelRate(id) {
    const payload = {
      id,
    };
    return FuelConsumptionRateService.delete(payload, getFuelRates, 'json');
  }

  getFuelOperations(payload) {
    return getFuelOperations(payload);
  }

  createFuelOperation(formState) {
    const payload = {};
    if (typeof formState.name === 'string' && formState.name !== '') {
      payload.name = formState.name;
      payload.equipment = !!formState.equipment;
      payload.measure_unit_id = formState.measure_unit_id;
      payload.is_excluding_mileage = !!formState.is_excluding_mileage;
    }

    return FuelOperationsService.post(payload, getFuelOperations, 'json');
  }

  updateFuelOperation(formState) {
    const payload = {
      id: formState.id,
    };
    if (typeof formState.name === 'string' && formState.name !== '') {
      payload.name = formState.name;
      payload.equipment = !!formState.equipment;
      payload.measure_unit_id = formState.measure_unit_id;
      payload.is_excluding_mileage = !!formState.is_excluding_mileage;
    }
    return FuelOperationsService.put(payload, getFuelOperations, 'json');
  }

  deleteFuelOperation(id) {
    const payload = {
      id,
    };
    return FuelOperationsService.delete(payload, getFuelOperations, 'json');
  }

}
