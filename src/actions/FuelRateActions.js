import { Actions } from 'flummox';
import {
  FuelConsumptionRateService,
  FuelOperationsService,
} from 'api/Services';

function getFuelOperations(payload = {}) {
  return FuelOperationsService.get(payload).then((r) => ({
    result: r.result.rows,
  }));
}

function getFuelRates(payload = {}) {
  return FuelConsumptionRateService.get(payload).then((r) => ({
    result: r.result.rows,
  }));
}

export default class FuelRateActions extends Actions {
  getFuelRates() {
    // -
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

  getFuelOperations(payload) {
    return getFuelOperations(payload);
  }
}
