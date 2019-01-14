import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetPosition,
} from 'redux-main/reducers/modules/employee/position/promise';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';

/* ---------- Position ---------- */
export const employeePositionSetPosition = (positionList: IStateEmployee['positionList'], dataIndex: IStateEmployee['positionIndex']) => (dispatch) => (
  dispatch(
    employeeSetNewData({
      positionList,
    }),
  )
);
export const employeePositionResetSetPosition = () => (dispatch) => (
  dispatch(
    employeePositionSetPosition([], {}),
  )
);
export const employeePositionGetSetPosition: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetPosition(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const positionGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data, dataIndex } } = await dispatch(
    employeePositionGetSetPosition(payload, { page, path }),
  );

  dispatch(
    employeePositionSetPosition(data, dataIndex),
  );

  return {
    positionList: data,
    positionIndex: dataIndex,
  };
};
