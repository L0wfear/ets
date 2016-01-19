import { Store } from 'flummox';
import _ from 'lodash';

class ObjectsStore extends Store {

  constructor(flux) {
    super();

    const objectsActions = flux.getActions('objects');
    const carActions = flux.getActions('car');
    this.register(carActions.updateCarAdditionalInfo, this.handleGetCars);
    this.register(objectsActions.getCars, this.handleGetCars);
    this.register(objectsActions.getModels, this.handleGetModels);
    this.register(objectsActions.getTypes, this.handleGetTypes);
    this.register(objectsActions.getOkrugs, this.handleGetOkrugs);
    this.register(objectsActions.getCustomers, this.handleGetCustomers);
    this.register(objectsActions.getOwners, this.handleGetOwners);
    this.register(objectsActions.getFuelTypes, this.handleGetFuelTypes);

    this.state = {
      carsList: [],
      customersList: [],
      typesList: [],
      modelsList: [],
      okrugsList: [],
      ownersList: [],
      fuelTypes: [],
    };

  }

  handleGetCars(cars) {
    const carsList = cars.result.map( c => {
      let model = _.find(this.state.modelsList, m => m.id === c.model_id);
      if (model) {
        c.model = model.title;
      } else {
        c.model = 'Н/Д';
      }
      let type = _.find(this.state.typesList, t => t.id === c.type_id);
      if (type) {
        c.type = type.title;
      } else {
        c.type = 'Н/Д';
      }
      return c;
    });

    this.setState({carsList});
  }

  handleGetModels(modelsList) {
    this.setState({modelsList});
  }

  handleGetTypes(typesList) {
    this.setState({typesList});
  }

  handleGetOkrugs(okrugsList) {
    this.setState({okrugsList});
  }

  handleGetOwners(ownersList) {
    this.setState({ownersList});
  }

  handleGetCustomers(customersList) {
    this.setState({customersList});
  }

  handleGetFuelTypes(fuelTypes) {
    this.setState({fuelTypes: fuelTypes.result});
  }

  getCarById(asuods_id) {
    return _.find(this.state.carsList, c => c.asuods_id === asuods_id) || {};
  }


}

export default ObjectsStore;
