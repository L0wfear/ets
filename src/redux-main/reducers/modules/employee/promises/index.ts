import { DriverService, EmployeeService } from 'api/Services';
import { get } from 'lodash';

/* ------------- EMPLOYEE ------------- */
export const employeeLoadEmployee = (payload = {}) => (
  EmployeeService.get({ ...payload })
    .catch((error) => {
      // tslint:disable-next-line
      console.log(error);

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
export const employeeUpdateCar = (ownPayload) => {
  return Promise.reject();
};

/* ------------- DRIVERS ------------- */
export const employeeLoadDriver = (payload = {}) => (
  DriverService.get({ ...payload })
    .catch((error) => {
      // tslint:disable-next-line
      console.log(error);

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
