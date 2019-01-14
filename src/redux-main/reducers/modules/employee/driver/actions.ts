import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetDriver,
} from 'redux-main/reducers/modules/employee/driver/promise';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';

/* ---------- Driver ---------- */
export const employeeDriverSetDriver = (driverList: IStateEmployee['driverList'], dataIndex: IStateEmployee['driverIndex']) => (dispatch) => (
  dispatch(
    employeeSetNewData({
      driverList,
    }),
  )
);
export const employeeDriverResetSetDriver = () => (dispatch) => (
  dispatch(
    employeeDriverSetDriver([], {}),
  )
);
export const employeeDriverGetSetDriver: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetDriver(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const driverGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data, dataIndex } } = await dispatch(
    employeeDriverGetSetDriver(payload, { page, path }),
  );

  dispatch(
    employeeDriverSetDriver(data, dataIndex),
  );

  return {
    driverList: data,
    driverIndex: dataIndex,
  };
};
