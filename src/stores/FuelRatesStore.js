import { Store } from 'flummox';

export default class FuelRatesStore extends Store {
  constructor(flux) {
    super();

    const fuelRateActions = flux.getActions('fuelRates');
    this.register(fuelRateActions.getFuelRates, this.handleGetFuelRates);
    this.register(
      fuelRateActions.getFuelOperations,
      this.handleGetFuelOperations,
    );
    this.register(
      fuelRateActions.deleteFuelOperation,
      this.handleGetFuelOperations,
    );

    this.state = {
      rates: [],
      operations: [],
    };
  }

  handleGetFuelRates({ result }) {
    this.setState({ rates: result });
  }

  handleGetFuelOperations({ result }) {
    this.setState({ operations: result });
  }
}
