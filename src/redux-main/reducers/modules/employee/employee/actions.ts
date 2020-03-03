import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetEmployee,
  createSetEmployee,
  updateSetEmployee,
  removeSetEmployee,
  promsieGetEmployeeBindedToCarService,
} from 'redux-main/reducers/modules/employee/employee/promise';
import {
  IStateEmployee,
  Employee,
} from 'redux-main/reducers/modules/employee/@types/employee.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EmployeeBindedToCar } from 'components/new/utils/context/loading/@types/by_service/employee_binded_to_car';

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

export const actionSetInStoreEmployeeBindedToCar = (employeeBindedToCarList: IStateEmployee['employeeBindedToCarList']): EtsAction<EtsActionReturnType<typeof employeeSetNewData>> => (dispatch) => (
  dispatch(
    employeeSetNewData({
      employeeBindedToCarList,
      uniqEmployeesBindedOnCarList: Object.values(
        employeeBindedToCarList.reduce<Record<EmployeeBindedToCar['employee_id'], EmployeeBindedToCar>>(
          (newObj, partialEmployee) => {
            if (!newObj[partialEmployee.employee_id]) {
              newObj[partialEmployee.employee_id] = partialEmployee;
            } else if (partialEmployee.binding_type === 'primary') {
              newObj[partialEmployee.employee_id] = partialEmployee;
            }

            return newObj;
          },
          {},
        ),
      ),
    }),
  )
);
export const actionResetEmployeeBindedToCarList = (): EtsAction<EtsActionReturnType<typeof employeeEmployeeSetEmployee>> => (dispatch) => {
  return dispatch(
    actionSetInStoreEmployeeBindedToCar([]),
  );
};
export const actionGetEmployeeBindedToCarService = (payload: Parameters<typeof promsieGetEmployeeBindedToCarService>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promsieGetEmployeeBindedToCarService>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promsieGetEmployeeBindedToCarService(payload),
    meta,
  )
);
export const actionGetAndSetInStoreEmployeeBindedToCarService = (payload: Parameters<typeof actionGetEmployeeBindedToCarService>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetEmployeeBindedToCarService>> => async (dispatch) => {
  const result = await dispatch(
    actionGetEmployeeBindedToCarService(payload, meta),
  );

  dispatch(
    actionSetInStoreEmployeeBindedToCar(result),
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
