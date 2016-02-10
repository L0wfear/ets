import { Actions } from 'flummox';
import { getCars, getFuelTypes, getTechOperations, getWorkKinds, getODHReports, getODHs } from '../adapter.js';
import _ from 'lodash';
import { getCustomers } from '../customers.js';
import { getTypes } from '../types.js';
import { fetchModels } from '../models.js';
import { getOkrugs } from '../okrugs.js';
import { getOwners } from '../owners.js';

export default class ObjectsActions extends Actions {

  getCars(technical_operation_id) {
    const payload = {};
    if (typeof technical_operation_id !== 'undefined') {
      payload.technical_operation_id = technical_operation_id;
    }
    return getCars(payload);
  }

  getModels() {
    return fetchModels();
  }

  getCustomers() {
    return getCustomers();
  }

  getOwners() {
    return getOwners();
  }

  getOkrugs() {
    return getOkrugs();
  }

  getTypes() {
    return getTypes();
  }

  getFuelTypes() {
    return getFuelTypes();
  }

  getTechOperations() {
    return getTechOperations();
  }

  getODHs() {
    return getODHs();
  }

  getWorkKinds() {
    return getWorkKinds();
  }

  getODHReports() {
    return getODHReports();
  }

}
