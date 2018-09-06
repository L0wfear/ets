import { Store } from 'flummox';
import _ from 'lodash';

const colors = [];

Array(16).fill(1).map((d, r) => 
  Array(16).fill(1).map((d, g) => 
    Array(16).fill(1).map((d, b) => 
    colors.push(`rgb(${r * 16}, ${g * 16}, ${b * 16})`)
    )
  )
);

export default class ObjectsStore extends Store {

  constructor(flux) {
    super();

    const objectsActions = flux.getActions('objects');
    const carActions = flux.getActions('cars');
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const companyStructreActions = flux.getActions('companyStructure');

    this.register(carActions.updateCarAdditionalInfo, this.handleGetCars);
    this.register(carActions.getTrack, this.handleGetTrack);
    this.register(carActions.getCarsByTechnicalOperation, this.handleGetCarsByTechnicalOperation);

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
    this.register(objectsActions.getOrders, this.handlegetOrders);
    this.register(objectsActions.resetOrder, this.handlegetOrders);
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
    this.register(objectsActions.getWorkMode, this.handleGetWorkMode);

    this.register(companyStructreActions.getCompanyStructure, this.handleGetCompanyStructure);
    this.register(companyStructreActions.createCompanyElement, this.handleGetCompanyStructureAfterCUD);
    this.register(companyStructreActions.updateCompanyElement, this.handleGetCompanyStructureAfterCUD);
    this.register(companyStructreActions.deleteCompanyElement, this.handleGetCompanyStructureAfterCUD);

    this.register(technicalOperationsActions.getTechnicalOperations, this.handleGetTechOperations);
    this.register(technicalOperationsActions.getTechnicalOperationsRegistry, this.handleGetTechOperationsRegistry);
    this.register(technicalOperationsActions.getTechnicalOperationRelations, this.handleGetTechnicalOperationRelations);
    this.register(technicalOperationsActions.updateTechnicalOperation, this.handleGetTechOperationsRegistry);
    this.register(technicalOperationsActions.getTechnicalOperationsObjects, this.handleGetTechnicalOperationsObjects);
    this.register(technicalOperationsActions.getTechnicalOperationsTypes, this.handleGetTechnicalOperationsTypes);


    this.state = {
      carsList: [],
      carListBuyTO: [],
      track: {},
      customersList: [],
      typesList: [],
      sensorTypesList: [],
      modelsList: [],
      specialModelsList: [],
      fuelTypes: [],
      technicalOperationsList: [],
      technicalOperationsRegistryList: [],
      technicalOperationRelationsList: [],
      workKindsList: [],
      OrdersList: [],
      technicalOperationsObjectsList: [],
      technicalOperationsTypesList: [],
      companyStructureList: [],
      companyStructureLinearList: [],
      companyStructureLinearForUserList: [],
      positionsList: [],
      organizations: [],
      materialConsumptionRateList: [],
      cleanCategoriesList: [],
      maintenanceWorkList: [],
      cleaningRateList: [],
      userActionLogList: [],
      medicalStatsList: [],
      companyStructureLinearList: [],
      appConfig: {},

      carsIndex: {},
      modelsIndex: {},
      typesIndex: {},
      technicalOperationsObjectsIndex: {},

      ordersTotalCount: 0,

      workMode: [],
      workModeOptions: [],
    };
  }

  handleGetTechnicalOperationsObjects({ result: { rows = [] } = {} }) {
    rows.forEach((obj) => {
      if (obj.short_name === 'ОДХ') {
        obj.type = 'mixed';
      } else if (obj.short_name === 'ДТ') {
        obj.type = 'simple_dt';
      } else if (obj.short_name === 'ПН') {
        obj.type = 'points';
      }
    });
    this.setState({ technicalOperationsObjectsList: rows });
  }

  handleGetTechnicalOperationsTypes(technicalOperationsTypes) {
    this.setState({ technicalOperationsTypesList: technicalOperationsTypes.result });
  }

  handleGetCompanyStructure({ data: { result = [] }, linear = false, descendants_by_user = false }) {
    const myName = this.getNameCompanyStructureList(linear, descendants_by_user);

    this.setState({ [myName]: result });
  }
  handleGetCompanyStructureAfterCUD({ result = [] }) {
    this.setState({ companyStructureList: result });
  }
  getNameCompanyStructureList(linear, descendants_by_user) {
    if (linear) {
      if (descendants_by_user) {
        return 'companyStructureLinearForUserList';
      }
      return 'companyStructureLinearList';
    }
    return 'companyStructureList';
  }

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
  handleGetCarsByTechnicalOperation(result) {
    this.setState({ carListBuyTO: result });
  }

  handleGetTrack(track) {
    this.setState({ track });
  }

  handleGetModels({ result: { rows = [] } }) {
    const modelsIndex = _.keyBy(rows, 'id');
    this.setState({ modelsList: rows, modelsIndex });
  }

  handleGetSpecialModels({ result: { rows: specialModelsList } }) {
    this.setState({ specialModelsList });
  }

  handleGetTypes({ result: { rows = [] } }) {
    const typesList = rows;
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
  handleGetTechOperationsRegistry(techOperations) {
    this.setState({ technicalOperationsRegistryList: techOperations.result });
  }
  handleGetTechnicalOperationRelations({ result }) {
    this.setState({ technicalOperationRelationsList: result });
  }

  // Убрать второй вариант
  handleGetWorkKinds(workKinds) {
    this.setState({ workKindsList: workKinds.result.rows || workKinds.result });
  }

  handleGetOrganizations(organizations) {
    const organizationsNew = organizations.result.map(company => ({
      ...company,
      rgb_color: company.rgb_color || colors[Math.ceil(Math.random() * 4096)],
    }));

    this.setState({
      organizations: organizationsNew,
      organizationsIndex: _.keyBy(organizationsNew, 'company_id'),
    });
  }

  handlegetOrders({ result: OrdersList = [], total_count: ordersTotalCount = 0 }) {
    this.setState({ OrdersList, ordersTotalCount });
  }

  handleGetPositions({ result: { rows: positionsList } }) {
    this.setState({ positionsList });
  }

  handleGetConfig(appConfig) {
    this.setState({ appConfig });
  }

  handleGetMaterialConsumptionRate(rates) {
    const materialConsumptionRateList = rates.result.rows || rates.result;
    this.setState({ materialConsumptionRateList });
  }

  handleGetMaintenanceWork({ result: { rows: maintenanceWorkList } }) {
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

  handleGetCleanCategories({ result: { rows: cleanCategoriesList } }) {
    this.setState({ cleanCategoriesList });
  }

  handleGetUserActionLog(userActionLogList) {
    this.setState({ userActionLogList: userActionLogList.result.rows });
  }

  handleGetMedicalStats(medicalStatsList) {
    this.setState({ medicalStatsList: medicalStatsList.result.rows });
  }

  handleGetCountry({ result: { rows = [] } }) {
    this.setState({
      countryList: rows,
      countryOptions: rows.map(one => ({ value: one.id, label: one.short_name })),
    });
  }

  handleGetWorkMode({ result: { rows = [] } }) {
    this.setState({
      workMode: rows,
      workModeOptions: rows.map(({ id, name, start_time_text, end_time_text }) => ({ value: id, label: `${name} (${start_time_text} - ${end_time_text})`, name })),
    });
  }
}
