import { Actions } from 'flummox';
import {
  EmployeeService,
  EmployeeBindedToCarService,
  EmployeeOnCarService,
  DriverService,
  ForemanService,
  LastBrigadeService,
  WaybillDriverService,
} from 'api/Services';
import { createValidDateTime } from 'utils/dates';

const makeFilesToFrontendAll = (rows) =>
  rows.map(({ files = [], ...other }) => ({
    ...other,
    driver_license_files: files.filter(
      (file) => file.kind === 'driver_license',
    ),
    medical_certificate_files: files.filter(
      (file) => file.kind === 'medical_certificate',
    ),
    assignment_files: files.filter((file) => file.kind === 'assignment'),
  }));

function getEmployees(payload = {}) {
  return EmployeeService.get(payload).then((r) => ({
    result: makeFilesToFrontendAll(r.result.rows),
  }));
}

export default class EmployeesActions extends Actions {
  async getEmployees(props) {
    const payload = {
      ...props,
    };
    return getEmployees(payload);
  }

  async getEmployeeBindedToCar(asuods_id) {
    return EmployeeBindedToCarService.path(asuods_id)
      .get({})
      .then(({ result: { rows } }) => rows);
  }

  getEmployeeOnCarList(props) {
    const payload = {
      ...props,
    };

    return EmployeeOnCarService.get(payload).then(({ result: { rows } }) => ({
      result: rows,
    }));
  }

  getDrivers() {
    return DriverService.get();
  }

  getForemans() {
    return ForemanService.get();
  }

  getLastBrigade(id) {
    return LastBrigadeService.path(id)
      .get()
      .then(({ result: { last_brigade, last_brigade_fios } }) =>
        last_brigade
          ? last_brigade
            .filter((item) => !!item)
            .map((empId, index) => ({
              id: Number(empId),
              full_name: last_brigade_fios[index],
            }))
          : [],
      );
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
}
