import { Actions } from 'flummox';
import { getCustomers } from '../adapter.js';
import _ from 'lodash';
import { fetchModels } from '../models.js';
import { getOkrugs } from '../okrugs.js';
import { getOwners } from '../owners.js';
import { isEmpty } from 'utils/functions';
import { createValidDateTime } from 'utils/dates';
import { FaxogrammService, WorkKindsService, TechnicalOperationService, FuelTypeService, CarService, CustomersService, TypesService, CarFuncTypeService, ODHService } from 'api/Services';

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
    return fetchModels();
  }

  getCustomers() {
    return CustomersService.get();
  }

  getOwners() {
    return getOwners();
  }

  getOkrugs() {
    return getOkrugs();
  }

  getTypes() {
    return TypesService.get();
  }

  getFuelTypes() {
    return FuelTypeService.get();
  }

  getTechOperations() {
    return TechnicalOperationService.get();
  }

  updateTechOperation(data) {
    const payload = _.cloneDeep(data);
    delete payload.season_name;
    delete payload.work_kind_name;
    delete payload.check_type_name;
    return TechnicalOperationService.put(payload, null, 'json');
  }

  getODHs() {
    return ODHService.get();
  }

  getWorkKinds() {
    return WorkKindsService.get();
  }

  getCarFuncTypes() {
    return CarFuncTypeService.get();
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

}
