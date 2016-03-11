import Store from './Store.js';
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
    this.register(objectsActions.getTechOperations, this.handleGetTechOperations);
    this.register(objectsActions.getWorkKinds, this.handleGetWorkKinds);
    this.register(objectsActions.getODHs, this.handleGetODHs);
    this.register(objectsActions.getFaxogramms, this.handleGetFaxogramms);
    this.register(objectsActions.getCarFuncTypes, this.handleGetCarFuncTypes);
    this.register(objectsActions.updateTechOperation, this.handleGetTechOperations);


    this.state = {
      carsList: [],
      customersList: [],
      typesList: [],
      modelsList: [],
      okrugsList: [],
      ownersList: [],
      fuelTypes: [],
      techOperationsList: [],
      workKindsList: [],
      odhsList: [],
      faxogrammsList: [],
      carFuncTypesList: [],

      carsIndex: {},
      modelsIndex: {},
      typesIndex: {},
      ownersIndex: {},
      carFuncTypesIndex: {},

      faxogrammsMaxPage: 0,
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
    let carsIndex = this.makeIndex(carsList, 'asuods_id');
    this.setState({carsList, carsIndex});
  }

  handleGetModels(modelsList) {
    let modelsIndex = this.makeIndex(modelsList);
    this.setState({modelsList, modelsIndex});
  }

  handleGetTypes(typesList) {
    let typesIndex = this.makeIndex(typesList);
    this.setState({typesList, typesIndex});
  }

  handleGetCarFuncTypes(carFuncTypes) {
    console.log('qwdqdw')
    let carFuncTypesIndex = this.makeIndex(carFuncTypes.result);
    this.setState({carFuncTypesList: carFuncTypes.result, carFuncTypesIndex});
  }

  handleGetOkrugs(okrugsList) {
    this.setState({okrugsList});
  }

  handleGetOwners(ownersList) {
    let ownersIndex = this.makeIndex(ownersList);
    this.setState({ownersList, ownersIndex});
  }

  handleGetCustomers(customersList) {
    this.setState({customersList});
  }

  handleGetFuelTypes(fuelTypes) {
    this.setState({fuelTypes: fuelTypes.result});
  }

  handleGetTechOperations(techOperations) {
    this.setState({techOperationsList: techOperations.result});
  }

  handleGetWorkKinds(workKinds) {
    this.setState({workKindsList: workKinds.result});
  }

  handleGetODHs(odhs) {
    this.setState({odhsList: odhs.result});
  }

  handleGetFaxogramms(faxogramms) {
    this.setState({faxogrammsList: faxogramms.result, faxogrammsMaxPage: faxogramms.total_pages});
  }

  getWorkKindById(id) {
    return _.find(this.state.workKindsList, wk => wk.id === id) || {};
  }

  getTechOperationById(id) {
    return _.find(this.state.techOperationsList, to => to.id === id) || {};
  }

  getCarById(asuods_id) {
    return _.find(this.state.carsList, c => c.asuods_id === asuods_id) || {};
  }

}

export default ObjectsStore;
