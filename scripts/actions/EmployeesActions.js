import { Actions } from 'flummox';
import { EmployeeService, DriverService } from 'api/Services';
import { createValidDate } from 'utils/dates';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';

export default class EmployeesActions extends Actions {

  getEmployees(isBrigade = false) {
    const payload = {};
    if (isBrigade) {
      payload.active = 1;
    }
    return EmployeeService.get(payload);
  }

  getDrivers() {
    return DriverService.get();
  }

  updateEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
    delete payload.position_name;
    delete payload.company_structure_name;
    delete payload.position_key;
    delete payload.full_name;
    payload.active = !!payload.active;

    _.mapKeys(payload, (v, k) => isEmpty(v) ? payload[k] = null : void 0);
    return EmployeeService.put(payload, true, 'json');
  }

  createEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
    delete payload.position_name;
    delete payload.position_key;
    payload.active = !!payload.active;
    _.mapKeys(payload, (v, k) => isEmpty(v) ? payload[k] = null : void 0);
    return EmployeeService.post(payload, true, 'json');
  }

  deleteEmployee(id) {
    const payload = { id };
    return EmployeeService.delete(payload);
  }

}
