import { Store } from 'flummox';
import _ from 'lodash';

class ObjectsStore extends Store {

  constructor(flux) {
    super();

    const objectsActions = flux.getActions('objects');
    const carActions = flux.getActions('cars');
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const companyStructreActions = flux.getActions('companyStructure');

    this.register(carActions.updateCarAdditionalInfo, this.handleGetCars);

    this.register(objectsActions.getCars, this.handleGetCars);
    this.register(objectsActions.getModels, this.handleGetModels);
    this.register(objectsActions.getSpecialModels, this.handleGetSpecialModels);
    this.register(objectsActions.getTypes, this.handleGetTypes);
    this.register(objectsActions.getCustomers, this.handleGetCustomers);
    this.register(objectsActions.getOwners, this.handleGetOwners);
    this.register(objectsActions.getFuelTypes, this.handleGetFuelTypes);
    this.register(objectsActions.getWorkKinds, this.handleGetWorkKinds);
    this.register(objectsActions.getOrganizations, this.handleGetOrganizations);
    this.register(objectsActions.getFaxogramms, this.handleGetFaxogramms);
    this.register(objectsActions.getPositions, this.handleGetPositions);

    this.register(companyStructreActions.getCompanyStructure, this.handleGetCompanyStructure);
    this.register(companyStructreActions.getCompanyList, this.handleGetCompanyList);
    this.register(companyStructreActions.updateCompanyElement, this.handleGetCompanyStructure);
    this.register(companyStructreActions.deleteCompanyElement, this.handleGetCompanyStructure);
    this.register(companyStructreActions.createCompanyElement, this.handleGetCompanyStructure);

    this.register(technicalOperationsActions.getTechnicalOperations, this.handleGetTechOperations);
    this.register(technicalOperationsActions.updateTechnicalOperation, this.handleGetTechOperations);
    this.register(technicalOperationsActions.getTechnicalOperationsObjects, this.handleGetTechnicalOperationsObjects);
    this.register(technicalOperationsActions.getTechnicalOperationsTypes, this.handleGetTechnicalOperationsTypes);


    this.state = {
      carsList: [],
      customersList: [],
      typesList: [],
      modelsList: [],
      specialModelsList: [],
      ownersList: [],
      fuelTypes: [],
      technicalOperationsList: [],
      workKindsList: [],
      faxogrammsList: [],
      technicalOperationsObjectsList: [],
      technicalOperationsTypesList: [],
      companyStructureList: [],
      positionsList: [],
      organizations: [],

      carsIndex: {},
      modelsIndex: {},
      typesIndex: {},
      ownersIndex: {},
      technicalOperationsObjectsIndex: {},

      faxogrammsMaxPage: 0,
    };

  }

  handleGetTechnicalOperationsObjects(technicalOperationsObjects) {
    let result = technicalOperationsObjects.result;
    _.each(result, obj => {
      if (obj.short_name === 'ОДХ') {
        obj.type = 'simple';
      } else if (obj.short_name === 'ДТ') {
        obj.type = 'simple_dt';
      } else if (obj.short_name === 'ПН') {
        obj.type = 'points';
      }
    });
    this.setState({technicalOperationsObjectsList: result});
  }

  handleGetTechnicalOperationsTypes(technicalOperationsTypes) {
    this.setState({technicalOperationsTypesList: technicalOperationsTypes.result});
  }

  handleGetCompanyStructure(companyStructure) {
    this.setState({companyStructureList: companyStructure.result})
  }

  handleGetCompanyList(companyList) {
    this.setState({companyList: companyList.result})
  }

  handleGetCars(cars) {
    const carsList = cars.result.map( c => {
      let model = _.find(this.state.modelsList, m => m.id === c.model_id);
          c.model = model ? model.title : 'Н/Д';
      let type = _.find(this.state.typesList, t => t.id === c.type_id);
          c.type = type ? type.title : 'Н/Д';
      return c;
    });
    let carsIndex = _.keyBy(carsList, 'asuods_id');
    this.setState({carsList, carsIndex});
  }

  handleGetModels(modelsList) {
    let modelsIndex = _.keyBy(modelsList, 'id');
    const carsList = this.state.carsList.map( c => {
      let model = _.find(modelsList, m => m.id === c.model_id);
          c.model = model ? model.title : 'Н/Д';
      return c;
    });
    let carsIndex = _.keyBy(carsList, 'asuods_id');
    this.setState({modelsList, modelsIndex});
  }

  handleGetSpecialModels({result}) {
    this.setState({specialModelsList: result});
  }

  handleGetTypes(typesList) {
    let typesIndex = _.keyBy(typesList, 'id');
    this.setState({typesList, typesIndex});
  }

  handleGetOwners(ownersList) {
    let ownersIndex = _.keyBy(ownersList, 'id');
    this.setState({ownersList, ownersIndex});
  }

  handleGetCustomers(customersList) {
    this.setState({customersList});
  }

  handleGetFuelTypes(fuelTypes) {
    this.setState({fuelTypes: fuelTypes.result});
  }

  handleGetTechOperations(techOperations) {
    this.setState({technicalOperationsList: techOperations.result});
  }

  handleGetWorkKinds(workKinds) {
    this.setState({workKindsList: workKinds.result});
  }

  handleGetOrganizations(organizations) {
    this.setState({organizations: organizations.result});
  }

  handleGetFaxogramms(faxogramms) {
    this.setState({faxogrammsList: faxogramms.result, faxogrammsMaxPage: faxogramms.total_pages});
  }

  handleGetPositions(positions) {
    this.setState({positionsList: positions.result});
  }

  getWorkKindById(id) {
    return _.find(this.state.workKindsList, wk => wk.id === id) || {};
  }

  getTechOperationById(id) {
    return _.find(this.state.technicalOperationsList, to => to.id === id) || {};
  }

  getCarById(asuods_id) {
    return _.find(this.state.carsList, c => c.asuods_id === asuods_id) || {};
  }

  getModelById(id) {
    return _.find(this.state.modelsList, c => c.id === id) || {};
  }

  getTypeById(id) {
    return _.find(this.state.typesList, t => t.id === id) || {};
  }

}

export default ObjectsStore;
