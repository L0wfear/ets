import { Store } from 'flummox';
import _ from 'lodash';

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
    this.register(fuelRateActions.updateFuelRate, this.handleUpdateRate);
    this.register(fuelRateActions.deleteFuelRate, this.handleDeleteRate);
    this.register(fuelRateActions.addFuelRate, this.handleAddRate);

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

  handleUpdateRate(newState) {
    let { rates } = this.state;
    const index = _.findIndex(rates, r => r.ID === newState.ID);
    console.log(rates[index]);
    rates[index] = newState;

    this.setState({rates});
  }

  handleAddRate(newRate) {
    let { rates } = this.state;
    rates.push(newRate);

    this.setState({rates});
  }

  handleDeleteRate(rate) {
    let { rates } = this.state;
    const index = _.findIndex(rates, r => r.ID === rate.ID);
    rates.splice(index, 1);

    this.setState({rates});
  }

}

export default FuelRatesStore;
