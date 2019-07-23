import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetDriver,
} from 'redux-main/reducers/modules/employee/driver/promise';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';

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
export const employeeDriverGetSetDriver = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof getSetDriver>, ReduxState, {}, AnyAction> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSetDriver(payload),
    meta,
  )
);
export const driverGetAndSetInStore = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof getSetDriver>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const result = await dispatch(
    employeeDriverGetSetDriver(payload, meta),
  );

  dispatch(
    employeeDriverSetDriver(result.data, result.dataIndex),
  );

  return result;
};
