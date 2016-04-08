import { Store } from 'flummox';
import _ from 'lodash';

class FuelRatesStore extends Store {

  constructor(flux) {
    super();

    const fuelRateActions = flux.getActions('fuel-rates');
    this.register(fuelRateActions.getFuelRates, this.handleGetFuelRates);
    this.register(fuelRateActions.getFuelOperations, this.handleGetFuelOperations);
    this.register(fuelRateActions.addFuelRate, this.handleGetFuelRates);
    this.register(fuelRateActions.updateFuelRate, this.handleGetFuelRates);
    this.register(fuelRateActions.deleteFuelRate, this.handleGetFuelRates);
    this.register(fuelRateActions.addFuelOperation, this.handleGetFuelOperations);

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

}

export default FuelRatesStore;
