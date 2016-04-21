import { Actions } from 'flummox';
import { EmployeeService, DriverService } from 'api/Services';
import { createValidDate } from 'utils/dates';
import _ from 'lodash';

export default class EmployeesActions extends Actions {

  getEmployees() {
    return EmployeeService.get();
  }

  getDrivers() {
    return DriverService.get();
  }

  updateEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    delete payload.position_name;
    delete payload.position_key;
    delete payload.full_name;
    payload.active = !!payload.active;
    return EmployeeService.put(payload);
  }

  createEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    delete payload.position_name;
    delete payload.position_key;
    payload.active = !!payload.active;
    return EmployeeService.post(payload);
  }

  deleteEmployee(id) {
    const payload = { id };
    return EmployeeService.delete(payload);
  }

}
