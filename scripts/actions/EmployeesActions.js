import { Actions } from 'flummox';
import { getEmployees, updateEmployee } from '../adapter.js';
import { createValidDate } from '../utils/dates.js';
import _ from 'lodash';

export default class EmployeesActions extends Actions {

  getEmployees() {
    return getEmployees();
  }

  updateEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    return updateEmployee(payload);
  }

}
