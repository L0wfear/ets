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
    this.register(objectsActions.getSensorTypes, this.handleGetSensorTypes);
    this.register(objectsActions.getCustomers, this.handleGetCustomers);
    this.register(objectsActions.getFuelTypes, this.handleGetFuelTypes);
    this.register(objectsActions.getWorkKinds, this.handleGetWorkKinds);
    this.register(objectsActions.getOrganizations, this.handleGetOrganizations);
    this.register(objectsActions.updateOrganizations, this.handleUpdateOrganizations);
    this.register(objectsActions.getFaxogramms, this.handleGetFaxogramms);
    this.register(objectsActions.getPositions, this.handleGetPositions);
    this.register(objectsActions.getConfig, this.handleGetConfig);
    this.register(objectsActions.getMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.createMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.updateMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.deleteMaterialConsumptionRate, this.handleGetMaterialConsumptionRate);
    this.register(objectsActions.getMaintenanceWork, this.handleGetMaintenanceWork);
    this.register(objectsActions.createMaintenanceWork, this.handleGetMaintenanceWork);
    this.register(objectsActions.updateMaintenanceWork, this.handleGetMaintenanceWork);
    this.register(objectsActions.deleteMaintenanceWork, this.handleGetMaintenanceWork);
    this.register(objectsActions.getCleaningRate, this.handleGetCleaningRate);
    this.register(objectsActions.createCleaningRate, this.handleGetCleaningRate);
    this.register(objectsActions.updateCleaningRate, this.handleGetCleaningRate);
    this.register(objectsActions.deleteCleaningRate, this.handleGetCleaningRate);
    this.register(objectsActions.getMaintenanceRate, this.handleGetMaintenanceRate);
    this.register(objectsActions.createMaintenanceRate, this.handleGetMaintenanceRate);
    this.register(objectsActions.updateMaintenanceRate, this.handleGetMaintenanceRate);
    this.register(objectsActions.deleteMaintenanceRate, this.handleGetMaintenanceRate);
    this.register(objectsActions.getCleanCategories, this.handleGetCleanCategories);
    this.register(objectsActions.getUserActionLog, this.handleGetUserActionLog);
    this.register(objectsActions.getMedicalStats, this.handleGetMedicalStats);
    this.register(objectsActions.getCountry, this.handleGetCountry);
    
    this.register(companyStructreActions.getCompanyStructure, this.handleGetCompanyStructure);
    this.register(companyStructreActions.getLinearCompanyStructure, this.handleGetLinearCompanyStructure);
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
      sensorTypesList: [],
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
      maintenanceWorkList: [],
      cleaningRateList: [],
      userActionLogList: [],
      medicalStatsList: [],

      appConfig: {},

      carsIndex: {},
      modelsIndex: {},
      typesIndex: {},
      technicalOperationsObjectsIndex: {},

      faxogrammsTotalCount: 0,
    };
  }

  handleGetTechnicalOperationsObjects(technicalOperationsObjects) {
    const result = technicalOperationsObjects.result;
    _.each(result, (obj) => {
      if (obj.short_name === 'ОДХ') {
        obj.type = 'mixed';
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
  handleGetLinearCompanyStructure(companyStructureLinear) {
    this.setState({ companyStructureLinearList: companyStructureLinear });
  }
  handleGetLinearCompanyStructure

  handleGetCars(cars) {
    const carsList = cars.result.map((c) => {
      const model = _.find(this.state.modelsList, m => m.id === c.model_id);
      c.model = model ? model.title : 'Н/Д';
      const type = _.find(this.state.typesList, t => t.asuods_id === c.type_id);
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

  handleGetTypes({ result }) {
    const typesList = result;
    const typesIndex = _.keyBy(typesList, 'asuods_id');
    this.setState({ typesList, typesIndex });
  }
  handleGetSensorTypes({ result }) {
    this.setState({ sensorTypesList: result });
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
    this.setState({ faxogrammsList: faxogramms.result, faxogrammsTotalCount: faxogramms.total_count });
  }

  handleGetPositions(positions) {
    this.setState({ positionsList: positions.result });
  }

  handleGetConfig(appConfig) {
    this.setState({ appConfig });
  }

  handleGetMaterialConsumptionRate(rates) {
    const materialConsumptionRateList = rates.result.rows || rates.result;
    this.setState({ materialConsumptionRateList });
  }

  handleGetMaintenanceWork(r) {
    const maintenanceWorkList = r.result.rows || r.result;
    this.setState({ maintenanceWorkList });
  }
  handleUpdateOrganizations(r) {
    const organizations = r.result.rows || r.result;
    this.setState({ organizations });
  }

  handleGetCleaningRate(r) {
    const cleaningRateList = r.result.rows || r.result;
    this.setState({ cleaningRateList });
  }

  handleGetMaintenanceRate(r) {
    const maintenanceRateList = r.result.rows || r.result;
    this.setState({ maintenanceRateList });
  }

  handleGetCleanCategories(r) {
    const cleanCategoriesList = r.result.rows || r.result;
    this.setState({ cleanCategoriesList });
  }

  handleGetUserActionLog(userActionLogList) {
    this.setState({ userActionLogList: userActionLogList.result.rows });
  }

  handleGetMedicalStats(medicalStatsList) {
    this.setState({ medicalStatsList: medicalStatsList.result.rows });
  }

  handleGetCountry({ data = [] }) {
    this.setState({
      countryList: data,
      countryOptions: data.map(one => ({ value: one.id, label: one.short_name })),
    });
  }
}
