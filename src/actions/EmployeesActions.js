import { Actions } from 'flummox';
import { EmployeeService, DriverService, WaybillDriverService } from 'api/Services';
import { createValidDate, createValidDateTime } from 'utils/dates';
import { isEmpty } from 'utils/functions';
import _ from 'lodash';

function getEmployees(payload = {}) {
  return EmployeeService.get(payload).then(r => ({ result: r.result.rows }));
}

export default class EmployeesActions extends Actions {

  async getEmployees(isBrigade = false) {
    const payload = {};
    if (isBrigade) {
      payload.active = 1;
    }
    return getEmployees(payload);
  }

  getDrivers() {
    return DriverService.get();
  }

  getWaybillDrivers({ type = 'before', date_from, date_to, ...restPayload }) {
    const opts = {
      ...restPayload,
      date_from: createValidDateTime(date_from),
      date_to: createValidDateTime(date_to),
      type,
    };

    return WaybillDriverService.get(opts);
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
      if (isEmpty(v)) {
        payload[k] = null;
      }
    });
    return EmployeeService.put(payload, getEmployees, 'json');
  }

  createEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = createValidDate(payload.birthday);
    payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
    delete payload.position_name;
    delete payload.position_key;
    payload.active = !!payload.active;
    _.mapKeys(payload, (v, k) => isEmpty(v) ? (payload[k] = null) : undefined);
    return EmployeeService.post(payload, getEmployees, 'json');
  }

  deleteEmployee(id) {
    const payload = { id };
    return EmployeeService.delete(payload, getEmployees, 'json');
  }

}
