import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';
import {
  getSetPosition,
} from 'redux-main/reducers/modules/employee/position/promise';
import { IStateEmployee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- Position ---------- */
export const employeePositionSetPosition = (positionList: IStateEmployee['positionList'], dataIndex: IStateEmployee['positionIndex']): EtsAction<EtsActionReturnType<typeof employeeSetNewData>> => (dispatch) => (
  dispatch(
    employeeSetNewData({
      positionList,
    }),
  )
);
export const employeePositionResetSetPosition = (): EtsAction<EtsActionReturnType<typeof employeePositionSetPosition>> => (dispatch) => (
  dispatch(
    employeePositionSetPosition([], {}),
  )
);
export const employeePositionGetSetPosition = (payload: Parameters<typeof getSetPosition>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetPosition>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSetPosition(payload),
    meta,
  )
);
export const positionGetAndSetInStore = (...arg: Parameters<typeof employeePositionGetSetPosition>): EtsAction<EtsActionReturnType<typeof employeePositionGetSetPosition>> => async (dispatch) => {
  const result = await dispatch(
    employeePositionGetSetPosition(...arg),
  );

  dispatch(
    employeePositionSetPosition(result.data, result.dataIndex),
  );

  return result;
};
