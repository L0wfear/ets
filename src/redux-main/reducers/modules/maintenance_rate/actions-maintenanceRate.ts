import {
  getMaintenanceRate,
  createMaintenanceRate,
  updateMaintenanceRate,
  deleteMaintenanceRate,
} from 'redux-main/reducers/modules/maintenance_rate/promises/index';

import {
  MaintenanceRate,
 } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

import { MAINTENANCE_RATE_SET_DATA } from 'redux-main/reducers/modules/maintenance_rate/maintenanceRate';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const maintenanceRateSetNewData = (newStateData: { maintenanceRateList: MaintenanceRate[] }) => ({
  type: MAINTENANCE_RATE_SET_DATA,
  payload: newStateData,
});

export const maintenanceRateGet = (payload: Parameters<typeof getMaintenanceRate>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getMaintenanceRate>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getMaintenanceRate(payload),
    meta,
  )
);

export const maintenanceRateGetAndSetInStore = (...arg: Parameters<typeof maintenanceRateGet>): EtsAction<EtsActionReturnType<typeof maintenanceRateGet>> => async (dispatch) => {
  const result = await dispatch(
    maintenanceRateGet(...arg),
  );

  dispatch(
    maintenanceRateSetNewData({ maintenanceRateList: result.maintenanceRateList }),
  );

  return result;
};

export const maintenanceRateCreate = (payload: Parameters<typeof createMaintenanceRate>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createMaintenanceRate>> => async (dispatch) => {
  const newMaintenanceRate = await etsLoadingCounter(
    dispatch,
    createMaintenanceRate(payload),
    meta,
  );
  await maintenanceRateGetAndSetInStore({}, meta);
  return newMaintenanceRate;
};

export const maintenanceRateUpdate = (payload: Parameters<typeof updateMaintenanceRate>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateMaintenanceRate>> => async (dispatch) => {
  const newMaintenanceRate = await etsLoadingCounter(
    dispatch,
    updateMaintenanceRate(payload),
    meta,
  );
  await maintenanceRateGetAndSetInStore({}, meta);
  return newMaintenanceRate;
};

export const maintenanceRateDelete = (id: Parameters<typeof deleteMaintenanceRate>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateMaintenanceRate>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    deleteMaintenanceRate(id),
    meta,
  );
};
