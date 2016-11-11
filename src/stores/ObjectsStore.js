import { Store } from 'flummox';
import _ from 'lodash';

export default class ObjectsStore extends Store {

  constructor(flux) {
    super();

    const objectsActions = flux.getActions('objects');
    const carActions = flux.getActions('cars');
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const companyStructreActions = flux.getActions('companyStructure');

    this.register(carActions.updateCarAdditionalInfo, this.handleGetCars);
    this.register(carActions.getTrack, this.handleGetTrack);

    this.register(objectsActions.getCars, this.handleGetCars);
    this.register(objectsActions.getModels, this.handleGetModels);
    this.register(objectsActions.getSpecialModels, this.handleGetSpecialModels);
    this.register(objectsActions.getTypes, this.handleGetTypes);
    this.register(objectsActions.getCustomers, this.handleGetCustomers);
    this.register(objectsActions.getFuelTypes, this.handleGetFuelTypes);
    this.register(objectsActions.getWorkKinds, this.handleGetWorkKinds);
    this.register(objectsActions.getOrganizations, this.handleGetOrganizations);
    this.register(objectsActions.getFaxogramms, this.handleGetFaxogramms);
    this.register(objectsActions.getPositions, this.handleGetPositions);
    this.register(objectsActions.getConfig, this.handleGetConfig);
    this.register(objectsActions.getMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.createMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.updateMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.deleteMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.getCleanCategories, this.handleGetCleanCategories);

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
      track: {},
      customersList: [],
      typesList: [],
      modelsList: [],
      specialModelsList: [],
      fuelTypes: [],
      technicalOperationsList: [],
      workKindsList: [],
      faxogrammsList: [],
      technicalOperationsObjectsList: [],
      technicalOperationsTypesList: [],
      companyStructureList: [],
      positionsList: [],
      organizations: [],
      materialConsumptionRateList: [],
      cleanCategoriesList: [],

      appConfig: {},

      carsIndex: {},
      modelsIndex: {},
      typesIndex: {},
      technicalOperationsObjectsIndex: {},

      faxogrammsMaxPage: 0,
    };
  }

  handleGetTechnicalOperationsObjects(technicalOperationsObjects) {
    const result = technicalOperationsObjects.result;
    _.each(result, (obj) => {
      if (obj.short_name === 'ОДХ') {
        obj.type = 'simple';
      } else if (obj.short_name === 'ДТ') {
        obj.type = 'simple_dt';
      } else if (obj.short_name === 'ПН') {
        obj.type = 'points';
      }
    });
    this.setState({ technicalOperationsObjectsList: result });
  }

  handleGetTechnicalOperationsTypes(technicalOperationsTypes) {
    this.setState({ technicalOperationsTypesList: technicalOperationsTypes.result });
  }

  handleGetCompanyStructure(companyStructure) {
    this.setState({ companyStructureList: companyStructure.result });
  }

  handleGetCompanyList(companyList) {
    this.setState({ companyList: companyList.result });
  }

  handleGetCars(cars) {
    const carsList = cars.result.map((c) => {
      const model = _.find(this.state.modelsList, m => m.id === c.model_id);
      c.model = model ? model.title : 'Н/Д';
      const type = _.find(this.state.typesList, t => t.id === c.type_id);
      c.type = type ? type.title : 'Н/Д';
      return c;
    });
    const carsIndex = _.keyBy(carsList, 'asuods_id');
    this.setState({ carsList, carsIndex });
  }

  handleGetTrack(track) {
    this.setState({ track });
  }

  handleGetModels(modelsList) {
    const modelsIndex = _.keyBy(modelsList, 'id');
    this.setState({ modelsList, modelsIndex });
  }

  handleGetSpecialModels({ result }) {
    this.setState({ specialModelsList: result });
  }

  handleGetTypes(typesList) {
    const typesIndex = _.keyBy(typesList, 'id');
    this.setState({ typesList, typesIndex });
  }

  handleGetCustomers(customersList) {
    this.setState({ customersList });
  }

  handleGetFuelTypes(fuelTypes) {
    this.setState({ fuelTypes: fuelTypes.result });
  }

  handleGetTechOperations(techOperations) {
    this.setState({ technicalOperationsList: techOperations.result });
  }

  handleGetWorkKinds(workKinds) {
    this.setState({ workKindsList: workKinds.result });
  }

  handleGetOrganizations(organizations) {
    this.setState({ organizations: organizations.result });
  }

  handleGetFaxogramms(faxogramms) {
    this.setState({ faxogrammsList: faxogramms.result, faxogrammsMaxPage: faxogramms.total_pages });
  }

  handleGetPositions(positions) {
    this.setState({ positionsList: positions.result });
  }

  handleGetConfig(appConfig) {
    this.setState({ appConfig });
  }

  handleGetMaterialConsumptionRate(rates) {
    this.setState({ materialConsumptionRateList: rates.result });
  }

  handleGetCleanCategories(categories) {
    this.setState({ cleanCategoriesList: categories.result });
  }

}
