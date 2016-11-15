import { Actions } from 'flummox';
import { EmployeeService, DriverService } from 'api/Services';
import { createValidDate } from 'utils/dates';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';

export default class EmployeesActions extends Actions {

  async getEmployees(isBrigade = false) {
    const payload = {};
    if (isBrigade) {
      payload.active = 1;
    }
    const res = await EmployeeService.get(payload);
    return ({ result: res.result.rows });
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

    _.mapKeys(payload, (v, k) => {
      isEmpty(v) ? payload[k] = null : undefined;
    });
    return EmployeeService.put(payload, () => EmployeeService.get().then(r => ({ result: r.result.rows })), 'json');
  }

  createEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
    delete payload.position_name;
    delete payload.position_key;
    payload.active = !!payload.active;
    _.mapKeys(payload, (v, k) => isEmpty(v) ? payload[k] = null : undefined);
    return EmployeeService.post(payload, () => EmployeeService.get().then(r => ({ result: r.result.rows })), 'json');
  }

  deleteEmployee(id) {
    const payload = { id };
    return EmployeeService.delete(payload, () => EmployeeService.get().then(r => ({ result: r.result.rows })), 'json');
  }

}
