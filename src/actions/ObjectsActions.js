import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import { createValidDateTime } from 'utils/dates';
import { get } from 'lodash';
import {
  OrderService,
  CarService,
  WaybillCarService,
  MissionCarService,
  TypesService,
  ModelsService,
  MaterialConsumptionRateService,
  CleanCategoriesService,
  MaintenanceWorkService,
  MaintenanceRateService,
  CleaningRateService,
  UserActionLogService,
  WorkMode,
  ConfigTrackService,
  SensorTypeService,
  MedicalStatsService,
} from 'api/Services';

function getMaterialConsumptionRates(payload = {}) {
  return MaterialConsumptionRateService.get(payload).then((r) => ({
    result: r.result.rows,
  }));
}

export default class ObjectsActions extends Actions {
  getCars(technical_operation_id) {
    const payload = {};
    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    } else {
      delete payload.technical_operation_id;
    }
    return CarService.get(payload).then((r) => ({ result: r.result.rows }));
  }

  getSomeCars(serviceType) {
    const payload = {};
    switch (serviceType) {
      case 'WaybillCarService':
        return WaybillCarService.get(payload).then((r) => ({
          result: r.result,
        }));
      case 'MissionCarService':
        return MissionCarService.get(payload).then((r) => ({
          result: r.result,
        }));
      default:
        return CarService.get(payload).then((r) => ({ result: r.result.rows }));
    }
  }

  getModels(special_model_id) {
    const payload = special_model_id ? { special_model_id } : null;
    return ModelsService.get(payload);
  }

  getTypes(payload = {}) {
    return TypesService.get(payload);
  }

  getSensorTypes() {
    return SensorTypeService.get().then((r) => ({ result: r.result.rows }));
  }

  getWorkMode() {
    return WorkMode.get();
  }

  getOrderById(id) {
    return OrderService.get({ id });
  }

  getTrackConfig() {
    return ConfigTrackService.get();
  }

  getMaterialConsumptionRate() {
    return getMaterialConsumptionRates();
  }

  createMaterialConsumptionRate(formState) {
    const payload = { ...formState };
    return MaterialConsumptionRateService.post(
      payload,
      getMaterialConsumptionRates,
      'json',
    );
  }

  updateMaterialConsumptionRate(formState) {
    const payload = { ...formState };
    return MaterialConsumptionRateService.path(formState.id).put(
      payload,
      getMaterialConsumptionRates,
      'json',
    );
  }

  deleteMaterialConsumptionRate(id) {
    return MaterialConsumptionRateService.path(id).delete(
      {},
      getMaterialConsumptionRates,
      'json',
    );
  }

  getCleanCategories() {
    return CleanCategoriesService.get();
  }

  getMaintenanceWork() {
    return MaintenanceWorkService.get();
  }

  createMaintenanceWork(formState) {
    const payload = { ...formState };
    return MaintenanceWorkService.post(
      payload,
      this.getMaintenanceWork,
      'json',
    );
  }

  updateMaintenanceWork(formState) {
    const payload = { ...formState };
    return MaintenanceWorkService.path(formState.id).put(
      payload,
      this.getMaintenanceWork,
      'json',
    );
  }

  deleteMaintenanceWork(id) {
    return MaintenanceWorkService.path(id).delete(
      {},
      this.getMaintenanceWork,
      'json',
    );
  }

  getCleaningRate(type) {
    const payload = { type };
    return CleaningRateService.get(payload);
  }

  createCleaningRate(type, formState) {
    const payload = {
      ...formState,
      type,
    };
    return CleaningRateService.post(
      payload,
      this.getCleaningRate.bind(this, type),
      'json',
    );
  }

  updateCleaningRate(type, formState) {
    const payload = {
      ...formState,
      type,
    };
    return CleaningRateService.path(formState.id).put(
      payload,
      this.getCleaningRate.bind(this, type),
      'json',
    );
  }

  deleteCleaningRate(type, id) {
    return CleaningRateService.path(id).delete(
      {},
      this.getCleaningRate.bind(this, type),
      'json',
    );
  }

  getMaintenanceRate(type) {
    const payload = { type };
    return MaintenanceRateService.get(payload);
  }

  createMaintenanceRate(type, formState) {
    const payload = {
      ...formState,
      type,
    };
    return MaintenanceRateService.post(
      payload,
      this.getMaintenanceRate.bind(this, type),
      'json',
    );
  }

  updateMaintenanceRate(type, formState) {
    const payload = {
      ...formState,
      type,
    };
    return MaintenanceRateService.path(formState.id).put(
      payload,
      this.getMaintenanceRate.bind(this, type),
      'json',
    );
  }

  deleteMaintenanceRate(type, id) {
    return MaintenanceRateService.path(id).delete(
      {},
      this.getMaintenanceRate.bind(this, type),
      'json',
    );
  }

  getUserActionLog(p = {}) {
    const payload = {
      date_start: createValidDateTime(p.date_start),
      date_end: createValidDateTime(p.date_end),
    };
    return UserActionLogService.get(payload).then((response) =>
      get(response, ['result', 'rows'], []).map((d) => {
        d.front_entity_number = d.entity_number;

        return d;
      }),
    );
  }

  getMedicalStats(p = {}) {
    const payload = {
      date_from: createValidDateTime(p.date_from),
      date_to: createValidDateTime(p.date_to),
    };
    return MedicalStatsService.get(payload);
  }
}
