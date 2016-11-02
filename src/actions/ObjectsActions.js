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
} from 'api/Services';

export default class ObjectsActions extends Actions {

  getCars(technical_operation_id) {
    const payload = {};
    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    } else {
      delete payload.technical_operation_id;
    }
    return CarService.get(payload);
  }

  getModels() {
    return ModelsService.get();
  }

  getSpecialModels() {
    return SpecialModelService.get();
  }

  getCustomers() {
    return CustomersService.get();
  }

  getTypes() {
    return TypesService.get();
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
    return MaterialConsumptionRateService.get();
  }

  createMaterialConsumptionRate(formState) {
    const payload = _.clone(formState);
    return MaterialConsumptionRateService.post(payload, true, 'json');
  }

  updateMaterialConsumptionRate(formState) {
    const payload = _.clone(formState);
    return MaterialConsumptionRateService.path(formState.id).put(payload, true, 'json');
  }

  deleteMaterialConsumptionRate(formState) {
    return MaterialConsumptionRateService.path(formState.id).delete();
  }

  getCleanCategories() {
    return CleanCategoriesService.get();
  }

}
