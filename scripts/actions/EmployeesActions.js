import { Actions } from 'flummox';
import { EmployeeService } from '../api/Services.js';
import { createValidDate } from 'utils/dates';
import _ from 'lodash';

export default class EmployeesActions extends Actions {

  getEmployees() {
    return EmployeeService.get();
  }

  updateEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    return EmployeeService.update(payload);
  }

}
