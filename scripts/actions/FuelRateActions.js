import { Actions } from 'flummox';
import { createValidDate } from '../utils/dates.js';
import _ from 'lodash';
import { FuelConsumptionRateService, FuelOperationsService } from '../api/Services.js';

export default class FuelRateActions extends Actions {

  constructor(props) {
    super();
  }

  getFuelRates() {
    return FuelConsumptionRateService.get();
  }

  getFuelRatesByCarModel(car_model_id) {
    const payload = { car_model_id }
    return FuelConsumptionRateService.get(payload);
  }

  getFuelOperations() {
    return FuelOperationsService.get();
  }

  updateFuelRate(newFuelRate) {
    const payload = _.clone(newFuelRate);
    delete payload.rate_on_date;
    delete payload.season;

    if (typeof payload.summer_rate === 'string' && payload.summer_rate.length === 0) {
      payload.summer_rate = null;
    }
    if (typeof payload.winter_rate === 'string' && payload.winter_rate.length === 0) {
      payload.winter_rate = null;
    }
    payload.order_date = createValidDate(payload.order_date);

    return FuelConsumptionRateService.update(payload);
  }

  deleteFuelRate(rate) {
    return FuelConsumptionRateService.delete(rate);
  }

  addFuelRate(rate) {
    const payload = _.clone(rate);
    payload.order_date = createValidDate(payload.order_date);
    return FuelConsumptionRateService.create(payload);
  }

}
