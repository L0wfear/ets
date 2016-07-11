import { Actions } from 'flummox';
import { getCustomers } from '../adapter.js';
import _ from 'lodash';
import { getOwners } from '../owners.js';
import { isEmpty } from 'utils/functions';
import { createValidDateTime } from 'utils/dates';
import { FaxogrammService,
         WorkKindsService,
         TechnicalOperationService,
         FuelTypeService,
         CarService,
         CustomersService,
         TypesService,
         ODHService,
         DTService,
         PositionService,
         ModelsService,
         SpecialModelService,
         SSPService } from 'api/Services';

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

  getOwners() {
    return getOwners();
  }

  getTypes() {
    return TypesService.get();
  }

  getFuelTypes() {
    return FuelTypeService.get();
  }

  getODHs() {
    return ODHService.get();
  }

  getDTs() {
    return DTService.get();
  }

  getSSPs() {
    return SSPService.get();
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

  updateODH(formState) {

    const payload = {
      id: formState.id,
      company_structure_id: formState.company_structure_id || null,
    };

    return ODHService.put(payload);
  }

  updateDT(formState) {

    const payload = {
      id: formState.id,
      dt_id: formState.dt_id,
      company_structure_id: formState.company_structure_id || null,
    };

    return DTService.put(payload);
  }

  getPositions() {
    return PositionService.get();
  }

}
