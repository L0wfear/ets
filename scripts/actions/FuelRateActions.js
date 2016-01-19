import { Actions } from 'flummox';
import { getFuelRates, getFuelOperations, getFuelRatesByCarModel } from '../adapter.js';

export default class FuelRateActions extends Actions {

  constructor(props) {
    super();
  }

  getFuelRates(operations) {
    return getFuelRates(operations);
  }

  getFuelOperations() {
    return getFuelOperations();
  }

  updateFuelRate(newFuelRate) {
    return newFuelRate;
  }

  deleteFuelRate(rate) {
    return rate;
  }

  addFuelRate(rate) {
    return rate;
  }

  getFuelRatesByCarModel(model_id) {
    return getFuelRatesByCarModel(model_id);
  }

}
