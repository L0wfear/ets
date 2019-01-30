import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetEmployee,
  createSetEmployee,
  updateSetEmployee,
  removeSetEmployee,
} from 'redux-main/reducers/modules/employee/employee/promise';
import {
  IStateEmployee,
  Employee,
} from 'redux-main/reducers/modules/employee/@types/employee.h';

/* ---------- Employee ---------- */
export const employeeEmployeeSetEmployee = (employeeList: IStateEmployee['employeeList'], employeeIndex: IStateEmployee['employeeIndex']) => (dispatch) => (
  dispatch(
    employeeSetNewData({
      employeeList,
      employeeIndex,
    }),
  )
);
export const employeeEmployeeResetSetEmployee = () => (dispatch) => (
  dispatch(
    employeeEmployeeSetEmployee([], {}),
  )
);
export const employeeEmployeeGetSetEmployee: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetEmployee(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const employeeGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data, dataIndex } } = await dispatch(
    employeeEmployeeGetSetEmployee(payload, { page, path }),
  );

  dispatch(
    employeeEmployeeSetEmployee(data, dataIndex),
  );

  return {
    employeeList: data,
    employeeIndex: dataIndex,
  };
};
export const employeeCreateEmployee: any = (employeeOld: Employee, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: employee } = await dispatch({
    type: 'none',
    payload: createSetEmployee(employeeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return employee;
};
export const employeeUpdateEmployee: any = (employeeOld: Employee, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: employee } = await dispatch({
    type: 'none',
    payload: updateSetEmployee(employeeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return employee;
};
export const employeeRemoveEmployee = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: removeSetEmployee(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
