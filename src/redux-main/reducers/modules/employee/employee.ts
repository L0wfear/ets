import { createPath } from 'redux-main/redux-utils';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';

const EMPLOYEE = createPath('EMPLOYEE');

export const EMPLOYEE_SET_DATA = EMPLOYEE`SET_DATA`;

const initialState: IStateEmployee = {
  employeeList: [],
  employeeIndex: {},
  driverList: [],
  driverIndex: {},
  positionList: [],
  positionIndex: {},

  employeeBindedToCarList: [],
  uniqEmployeesBindedOnCarList: [],

  waybillDriverList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case EMPLOYEE_SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};
