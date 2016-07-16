import { Store } from 'flummox';
import _ from 'lodash';

class FuelRatesStore extends Store {

  constructor(flux) {
    super();

    const fuelRateActions = flux.getActions('fuelRates');
    this.register(fuelRateActions.getFuelRates, this.handleGetFuelRates);
    this.register(fuelRateActions.getFuelOperations, this.handleGetFuelOperations);
    this.register(fuelRateActions.createFuelRate, this.handleGetFuelRates);
    this.register(fuelRateActions.updateFuelRate, this.handleGetFuelRates);
    this.register(fuelRateActions.deleteFuelRate, this.handleGetFuelRates);
    this.register(fuelRateActions.createFuelOperation, this.handleGetFuelOperations);
    this.register(fuelRateActions.deleteFuelOperation, this.handleGetFuelOperations);
    this.register(fuelRateActions.updateFuelOperation, this.handleGetFuelOperations);

    this.state = {
      rates: [],
      operations: [],
    };

  }

  handleGetFuelRates(rates) {
    this.setState({ rates: rates.result });
  }

  handleGetFuelOperations({result}) {
    this.setState({operations: result});
  }

  getFuelOperationById(id) {
    return _.find(this.state.operations, c => c.id === id) || {};
  }


}

export default FuelRatesStore;
