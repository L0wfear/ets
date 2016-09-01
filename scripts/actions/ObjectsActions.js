import { Actions } from 'flummox';
import { getCustomers } from '../adapter.js';
import _ from 'lodash';
import { isEmpty, saveData } from 'utils/functions';
import { createValidDateTime } from 'utils/dates';
import {
  FaxogrammService,
  WorkKindsService,
  TechnicalOperationService,
  FuelTypeService,
  CarService,
  CustomersService,
  TypesService,
  PositionService,
  ModelsService,
  SpecialModelService,
  OrganizationsService
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

  getFuelTypes() {
    return FuelTypeService.get();
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
      create_date_to: createValidDateTime(create_date_to)
    };
    return FaxogrammService.get(payload);
  }

  saveFaxogramm(id) {
    const payload = { id };
    return FaxogrammService.getBlob(payload);
  }

  getFaxogrammPDFUrl(id) {
    let URL = FaxogrammService.getUrl() + id;
    return URL;
  }

  getPositions() {
    return PositionService.get();
  }

}
