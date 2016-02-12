import { Actions } from 'flummox';
import { getCars, getFuelTypes, getTechOperations, getWorkKinds, getODHReports, getODHs, getFaxogramms } from '../adapter.js';
import _ from 'lodash';
import { getCustomers } from '../customers.js';
import { getTypes } from '../types.js';
import { fetchModels } from '../models.js';
import { getOkrugs } from '../okrugs.js';
import { getOwners } from '../owners.js';
import { isEmpty } from '../utils/functions.js';

export default class ObjectsActions extends Actions {

  getCars(technical_operation_id) {
    const payload = {};
    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    } else {
      delete payload.technical_operation_id;
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

  getFaxogramms(page) {
    const payload = {
      page,
      on_page: 15
    };
    return getFaxogramms(payload);
  }

}
