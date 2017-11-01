import { Actions } from 'flummox';
import { createValidDate } from 'utils/dates';
import _ from 'lodash';
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

  getEquipmentFuelRatesByCarModel(car_id) {
    const payload = {
      car_id,
      for_equipment: 1,
    };
    return getFuelRates(payload);
  }

  createFuelRate(rate) {
    const payload = _.clone(rate);
    delete payload.car_model_name;
    delete payload.car_special_model_name;

    payload.order_date = createValidDate(payload.order_date);

    _.mapKeys(payload, (v, k) => {
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

  getFuelOperations() {
    return getFuelOperations();
  }

  createFuelOperation(formState) {
    const payload = {};
    if (typeof formState.name === 'string' && formState.name !== '') {
      payload.name = formState.name;
      payload.equipment = !!formState.equipment || false;
    }

    return FuelOperationsService.post(payload, getFuelOperations, 'json');
  }

  updateFuelOperation(formState) {
    const payload = {
      id: formState.id,
    };
    if (typeof formState.name === 'string' && formState.name !== '') {
      payload.name = formState.name;
      payload.equipment = !!formState.equipment || false;
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
