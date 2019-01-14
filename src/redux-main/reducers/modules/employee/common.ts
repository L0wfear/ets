import {
  EMPLOYEE_SET_DATA,
} from 'redux-main/reducers/modules/employee/employee';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';

export const employeeSetNewData = (newStateData: { [K in keyof IStateEmployee]?: IStateEmployee[K] }) => ({
  type: EMPLOYEE_SET_DATA,
  payload: newStateData,
});
