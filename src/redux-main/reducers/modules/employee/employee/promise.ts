import {
  employeeLoadEmployee,
  employeeCreateEmployee,
  employeeUpdateEmployee,
  employeeDeleteEmployee,
} from 'redux-main/reducers/modules/employee/promises';
import {
  get,
  cloneDeep,
  keyBy,
} from 'lodash';
import { createValidDate } from 'components/@next/@utils/dates/dates';
import {
  Employee,
} from 'redux-main/reducers/modules/employee/@types/employee.h';

export const getEmployee = employeeLoadEmployee;
export const createEmployee = employeeCreateEmployee;
export const updateEmployee = employeeUpdateEmployee;
export const removeEmployee = employeeDeleteEmployee;

export const getFrontEmployee = (row: Employee) => {
  const files = get(row, 'files', []);

  row.driver_license_files = files.filter((file) => file.kind === 'driver_license');
  row.medical_certificate_files = files.filter((file) => file.kind === 'medical_certificate');
  row.assignment_files = files.filter((file) => file.kind === 'assignment');

  return row;
};
const makeFilesToBackendOne = (formState: Employee) => {
  const payload = cloneDeep(formState);
  const driver_license_files = get(formState, 'driver_license_files', []);
  const medical_certificate_files = get(formState, 'medical_certificate_files', []);
  const assignment_files = get(formState, 'assignment_files', []);

  payload.files = [
    ...driver_license_files.map((obj) => ({ ...obj, kind: 'driver_license' })),
    ...medical_certificate_files.map((obj) => ({ ...obj, kind: 'medical_certificate' })),
    ...assignment_files.map((obj) => ({ ...obj, kind: 'assignment' })),
  ];

  delete payload.driver_license_files;
  delete payload.medical_certificate_files;
  delete payload.assignment_files;

  return payload;
};

export const getSetEmployee = async (...payload) => {
  const { data: rawData } = await getEmployee(...payload);
  const data: Employee[] = rawData.map(getFrontEmployee);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};
export const createSetEmployee = (rawEmployee: Employee) => {
  const payload = makeFilesToBackendOne(rawEmployee);
  payload.birthday = createValidDate(payload.birthday);
  payload.drivers_license_date_end = createValidDate(payload.drivers_license_date_end);
  payload.special_license_date_end = createValidDate(payload.special_license_date_end);
  payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
  payload.assignment_date_start = createValidDate(payload.assignment_date_start);
  payload.assignment_date_end = createValidDate(payload.assignment_date_end);

  return createEmployee(
    payload,
  );
};
export const updateSetEmployee = (oldEmployee: Employee) => {
  const payload = makeFilesToBackendOne(oldEmployee);
  payload.birthday = createValidDate(payload.birthday);
  payload.drivers_license_date_end = createValidDate(payload.drivers_license_date_end);
  payload.special_license_date_end = createValidDate(payload.special_license_date_end);
  payload.medical_certificate_date = createValidDate(payload.medical_certificate_date);
  payload.assignment_date_start = createValidDate(payload.assignment_date_start);
  payload.assignment_date_end = createValidDate(payload.assignment_date_end);

  return updateEmployee(
    payload,
  );
};
export const removeSetEmployee = (id) => {
  return removeEmployee(
    id,
  );
};
