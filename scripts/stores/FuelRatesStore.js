import { Store } from 'flummox';

const defaultUser = {
  login: 'mayor',
  password: 'mayor',
  role: 'mayor'
};

class FuelRatesStore extends Store {

  constructor(flux) {
    super();

    const fuelRateActions = flux.getActions('fuel-rates');
    this.register(fuelRateActions.getFuelRates, this.handleGetFuelRates);
    this.register(fuelRateActions.getFuelOperations, this.handleGetFuelOperations);

    this.state = {
      rates: [], //document.referrer.match(/^https?:\/\/monitor.mos.ru/) ? defaultUser : null
      operations: [],
    };

  }

  handleGetFuelRates(rates) {
    this.setState({
      rates
    });
  }

  handleGetFuelOperations({result}) {
    this.setState({operations: result});
  }

  handleChangeRate() {

  }

  handleAddRate() {

  }

}

export default FuelRatesStore;
