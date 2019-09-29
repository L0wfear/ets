import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetDriver, promiseGetWaybillDriver,
} from 'redux-main/reducers/modules/employee/driver/promise';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';

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

export const actionSetInStoreWaybillDriver = (waybillDriverList: IStateEmployee['waybillDriverList']): EtsAction<EtsActionReturnType<typeof employeeSetNewData>> => (dispatch) => (
  dispatch(
    employeeSetNewData({
      waybillDriverList,
    }),
  )
);
export const actionResetWaybillDriver = (): EtsAction<EtsActionReturnType<typeof actionSetInStoreWaybillDriver>> => (dispatch) => (
  dispatch(
    actionSetInStoreWaybillDriver([]),
  )
);
export const actionGetWaybillDriver = (payload: Parameters<typeof promiseGetWaybillDriver>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetWaybillDriver>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetWaybillDriver(payload),
    meta,
  )
);
export const actionGetAndSetInStoreWaybillDriver = (payload: Parameters<typeof actionGetWaybillDriver>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetWaybillDriver>> => async (dispatch) => {
  const result = await dispatch(
    actionGetWaybillDriver(payload, meta),
  );

  dispatch(
    actionSetInStoreWaybillDriver(result),
  );

  return result;
};
