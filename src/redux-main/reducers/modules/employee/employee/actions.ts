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
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- Employee ---------- */
export const employeeEmployeeSetEmployee = (employeeList: IStateEmployee['employeeList'], employeeIndex: IStateEmployee['employeeIndex']): EtsAction<EtsActionReturnType<typeof employeeSetNewData>> => (dispatch) => (
  dispatch(
    employeeSetNewData({
      employeeList,
      employeeIndex,
    }),
  )
);
export const employeeEmployeeResetSetEmployee = (): EtsAction<EtsActionReturnType<typeof employeeEmployeeSetEmployee>> => (dispatch) => {
  return dispatch(
    employeeEmployeeSetEmployee([], {}),
  );
};
export const employeeEmployeeGetSetEmployee = (payload: object = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetEmployee>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSetEmployee(payload),
    meta,
  )
);

export const employeeGetAndSetInStore = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof employeeEmployeeGetSetEmployee>> => async (dispatch) => {
  const result = await dispatch(
    employeeEmployeeGetSetEmployee(payload, meta),
  );

  dispatch(
    employeeEmployeeSetEmployee(result.data, result.dataIndex),
  );

  return result;
};
export const employeeCreateEmployee = (employeeOld: Employee, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetEmployee>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetEmployee(employeeOld),
    meta,
  );
};
export const employeeUpdateEmployee = (employeeOld: Employee, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetEmployee>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetEmployee(employeeOld),
    meta,
  );
};

export const employeeRemoveEmployee = (id: Employee['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetEmployee>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    removeSetEmployee(id),
    meta,
  );
};
