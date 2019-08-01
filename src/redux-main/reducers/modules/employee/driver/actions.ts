import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetDriver,
} from 'redux-main/reducers/modules/employee/driver/promise';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

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
export const employeeDriverGetSetDriver = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof getSetDriver>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSetDriver(payload),
    meta,
  )
);
export const driverGetAndSetInStore = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof getSetDriver>> => async (dispatch) => {
  const result = await dispatch(
    employeeDriverGetSetDriver(payload, meta),
  );

  dispatch(
    employeeDriverSetDriver(result.data, result.dataIndex),
  );

  return result;
};
