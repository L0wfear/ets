import { Actions } from 'flummox';
import { getFuelRates, getFuelOperations } from '../adapter.js';

export default class FuelRateActions extends Actions {

  constructor(props) {
    super();
    console.log(props);
  }

  getFuelRates(operations) {
    return getFuelRates(operations);
  }

  getFuelOperations() {
    return getFuelOperations();
  }

}
