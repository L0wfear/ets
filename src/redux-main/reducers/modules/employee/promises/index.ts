import { DriverService, EmployeeService } from 'api/Services';
import { get } from 'lodash';

/* ------------- EMPLOYEE ------------- */
export const employeeLoadEmployee = (payload = {}) => (
  EmployeeService.get({ ...payload })
    .catch((error) => {
      console.info(error); // eslint-disable-line

      return {
        result: {
          rows: [],
        },
      };
    })
    .then((ans) => ({
      data: get(ans, ['result', 'rows'], []),
    }))
);
export const employeeCreateEmployee = (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return EmployeeService.post(
    payload,
    false,
    'json',
  );
};
export const employeeUpdateEmployee = (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return EmployeeService.path(ownPayload.id).put(
    payload,
    false,
    'json',
  );
};
export const employeeDeleteEmployee = (id) => {
  return EmployeeService.path(id).delete(
    {},
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};
/* ------------- DRIVERS ------------- */
export const employeeLoadDriver = (payload = {}) => (
  DriverService.get({ ...payload })
    .catch((error) => {
      console.info(error); // eslint-disable-line

      return {
        result: [],
      };
    })
    .then((ans) => {
      return ({
        data: get(ans, ['result'], []),
      });
    })
);
