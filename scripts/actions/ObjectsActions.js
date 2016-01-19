import { Actions } from 'flummox';
import { getCars, getFuelTypes } from '../adapter.js';
import _ from 'lodash';
import { getCustomers } from '../customers.js';
import { getTypes } from '../types.js';
import { fetchModels } from '../models.js';
import { getOkrugs } from '../okrugs.js';
import { getOwners } from '../owners.js';

export default class ObjectsActions extends Actions {

  getCars() {
    return getCars();
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

}
