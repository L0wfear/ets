import { Store } from 'flummox';
import _ from 'lodash';

export default class ObjectsStore extends Store {
  constructor(flux) {
    super();

    const objectsActions = flux.getActions('objects');

    this.register(objectsActions.getCars, this.handleGetCars);

    this.state = {
      carsList: [],
      carsIndex: {},
    };
  }

  handleGetCars(cars) {
    const carsList = cars.result;
    const carsIndex = _.keyBy(carsList, 'asuods_id');
    this.setState({ carsList, carsIndex });
  }
}
