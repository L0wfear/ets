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
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- Employee ---------- */
export const employeeEmployeeSetEmployee = (employeeList: IStateEmployee['employeeList'], employeeIndex: IStateEmployee['employeeIndex']) => (dispatch) => (
  dispatch(
    employeeSetNewData({
      employeeList,
      employeeIndex,
    }),
  )
);
export const employeeEmployeeResetSetEmployee = (): EtsAction<void> => (dispatch) => {
  dispatch(
    employeeEmployeeSetEmployee([], {}),
  );

  return null;
};
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

type EmployeeGetAndSetInStoreAns = {
  employeeList: Employee[],
  employeeIndex: Record<Employee['id'], Employee>;
};

export const employeeGetAndSetInStore = (payload: object, meta: LoadingMeta): EtsAction<Promise<EmployeeGetAndSetInStoreAns>> => async (dispatch) => {
  const { payload: { data, dataIndex } } = await dispatch(
    employeeEmployeeGetSetEmployee(payload, meta),
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
