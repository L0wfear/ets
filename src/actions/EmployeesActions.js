import { Actions } from 'flummox';
import { EmployeeService, DriverService, WaybillDriverService, ForemanService } from 'api/Services';
import { createValidDate, createValidDateTime } from 'utils/dates';
import { isEmpty } from 'utils/functions';
import { mapKeys, cloneDeep } from 'lodash';

const makeFilesToBackendOne = (formState) => {
  const payload = cloneDeep(formState)
  const { driver_license_files, medical_certificate_files } = payload;

  payload.files = [
    ...driver_license_files.map(obj => ({ ...obj, kind: 'driver_license' })),
    ...medical_certificate_files.map(obj => ({ ...obj, kind: 'medical_certificate' })),
  ];

  delete payload.driver_license_files;
  delete payload.medical_certificate_files;

  return payload;
};

const makeFilesToFrontendAll = rows =>
  rows.map(({ files = [], ...other }) => ({
    ...other,
    driver_license_files: files.filter(file => file.kind === 'driver_license'),
    medical_certificate_files: files.filter(file => file.kind === 'medical_certificate'),
  }));

function getEmployees(payload = {}) {
  return EmployeeService.get(payload).then(r => ({ result: makeFilesToFrontendAll(r.result.rows) }));
}

export default class EmployeesActions extends Actions {

  async getEmployees(props) {
    const payload = {
      ...props,
    };
    return getEmployees(payload);
  }

  getDrivers() {
    return DriverService.get();
  }

  getForemans() {
    return ForemanService.get();
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
    const payload = makeFilesToBackendOne(formState);
    payload.birthday = createValidDate(payload.birthday);
    payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
    delete payload.position_name;
    delete payload.company_structure_name;
    delete payload.position_key;
    delete payload.full_name;
    payload.active = !!payload.active;

    mapKeys(payload, (v, k) => {
      if (isEmpty(v)) {
        payload[k] = null;
      }
    });
    return EmployeeService.path(`${payload.id}`).put(payload, getEmployees, 'json');
  }

  createEmployee(formState) {
    const payload = makeFilesToBackendOne(formState);
    payload.birthday = createValidDate(payload.birthday);
    payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
    delete payload.position_name;
    delete payload.position_key;
    payload.active = !!payload.active;
    mapKeys(payload, (v, k) => isEmpty(v) ? (payload[k] = null) : undefined);
    return EmployeeService.post(payload, getEmployees, 'json');
  }

  deleteEmployee(id) {
    const payload = { id };
    return EmployeeService.path(`${id}`).delete(payload, getEmployees, 'json');
  }

}

