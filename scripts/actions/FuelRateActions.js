import { Actions } from 'flummox';
import { getFuelRates, getFuelOperations, getFuelRatesByCarModel, addFuelRate, updateFuelRate, deleteFuelRate } from '../adapter.js';
import { createValidDate } from '../utils/dates.js';
import _ from 'lodash';

export default class FuelRateActions extends Actions {

  constructor(props) {
    super();
  }

  getFuelRates() {
    return getFuelRates();
  }

  getFuelOperations() {
    return getFuelOperations();
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

    return updateFuelRate(payload);
  }

  deleteFuelRate(rate) {
    return deleteFuelRate(rate);
  }

  addFuelRate(rate) {
    const payload = _.clone(rate);
    payload.order_date = createValidDate(payload.order_date);
    return addFuelRate(payload);
  }

  getFuelRatesByCarModel(model_id) {
    return getFuelRatesByCarModel(model_id);
  }

}
