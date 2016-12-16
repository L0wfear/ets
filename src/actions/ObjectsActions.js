import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import { createValidDateTime } from 'utils/dates';
import _ from 'lodash';
import {
  FaxogrammService,
  WorkKindsService,
  CarService,
  CustomersService,
  TypesService,
  PositionService,
  ModelsService,
  SpecialModelService,
  OrganizationsService,
  ConfigService,
  MaterialConsumptionRateService,
  CleanCategoriesService,
  MaintenanceWorkService,
  MaintenanceRateService,
  CleaningRateService,
} from 'api/Services';

function getTypes(payload = {}) {
  return TypesService.get(payload).then(r => ({ result: r.result.rows }));
}

function getMaterialConsumptionRates(payload = {}) {
  return MaterialConsumptionRateService.get(payload).then(r => ({ result: r.result.rows }));
}

export default class ObjectsActions extends Actions {

  getCars(technical_operation_id) {
    const payload = {};
    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    } else {
      delete payload.technical_operation_id;
    }
    return CarService.get(payload).then(r => ({ result: r.result.rows }));
  }

  getModels(special_model_id) {
    const payload = special_model_id ? { special_model_id } : null;
    return ModelsService.get(payload);
  }

  getSpecialModels() {
    return SpecialModelService.get();
  }

  getCustomers() {
    return CustomersService.get();
  }

  getTypes() {
    return getTypes();
  }

  getOrganizations() {
    return OrganizationsService.get();
  }

  getWorkKinds() {
    return WorkKindsService.get();
  }

  getFaxogramms(page, create_date_from, create_date_to) {
    const payload = {
      page,
      on_page: 15,
      create_date_from: createValidDateTime(create_date_from),
      create_date_to: createValidDateTime(create_date_to),
    };
    return FaxogrammService.get(payload);
  }

  saveFaxogramm(id) {
    return FaxogrammService.path(id).getBlob();
  }

  getFaxogrammPDFUrl(id) {
    const URL = `${FaxogrammService.getUrl()}/${id}`;
    return URL;
  }

  getPositions() {
    return PositionService.get();
  }

  getConfig() {
    return ConfigService.get();
  }

  getMaterialConsumptionRate() {
    return getMaterialConsumptionRates();
  }

  createMaterialConsumptionRate(formState) {
    const payload = _.clone(formState);
    return MaterialConsumptionRateService.post(payload, getMaterialConsumptionRates, 'json');
  }

  updateMaterialConsumptionRate(formState) {
    const payload = _.clone(formState);
    return MaterialConsumptionRateService.path(formState.id).put(payload, getMaterialConsumptionRates, 'json');
  }

  deleteMaterialConsumptionRate(id) {
    return MaterialConsumptionRateService.path(id).delete({}, getMaterialConsumptionRates, 'json');
  }

  getCleanCategories() {
    return CleanCategoriesService.get();
  }

  getMaintenanceWork() {
    return MaintenanceWorkService.get();
  }

  createMaintenanceWork(formState) {
    const payload = _.clone(formState);
    return MaintenanceWorkService.post(payload, this.getMaintenanceWork, 'json');
  }

  updateMaintenanceWork(formState) {
    const payload = _.clone(formState);
    return MaintenanceWorkService.path(formState.id).put(payload, this.getMaintenanceWork, 'json');
  }

  deleteMaintenanceWork(id) {
    return MaintenanceWorkService.path(id).delete({}, this.getMaintenanceWork, 'json');
  }

  getCleaningRate(type) {
    const payload = { type };
    return CleaningRateService.get(payload);
  }

  createCleaningRate(type, formState) {
    const payload = _.clone(formState);
    payload.type = type;
    return CleaningRateService.post(payload, this.getCleaningRate.bind(this, type), 'json');
  }

  updateCleaningRate(type, formState) {
    const payload = _.clone(formState);
    payload.type = type;
    return CleaningRateService.path(formState.id).put(payload, this.getCleaningRate.bind(this, type), 'json');
  }

  deleteCleaningRate(type, id) {
    return CleaningRateService.path(id).delete({}, this.getCleaningRate.bind(this, type), 'json');
  }

  getMaintenanceRate(type) {
    const payload = { type };
    return MaintenanceRateService.get(payload);
  }

  createMaintenanceRate(type, formState) {
    const payload = _.clone(formState);
    payload.type = type;
    return MaintenanceRateService.post(payload, this.getMaintenanceRate.bind(this, type), 'json');
  }

  updateMaintenanceRate(type, formState) {
    const payload = _.clone(formState);
    payload.type = type;
    return MaintenanceRateService.path(formState.id).put(payload, this.getMaintenanceRate.bind(this, type), 'json');
  }

  deleteMaintenanceRate(type, id) {
    return MaintenanceRateService.path(id).delete({}, this.getMaintenanceRate.bind(this, type), 'json');
  }

}
