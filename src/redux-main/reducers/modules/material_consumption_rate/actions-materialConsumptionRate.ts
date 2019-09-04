import {
  getMaterialConsumptionRate,
  createMaterialConsumptionRate,
  updateMaterialConsumptionRate,
  deleteMaterialConsumptionRate,
} from 'redux-main/reducers/modules/material_consumption_rate/promises/index';

import {
  MaterialConsumptionRate,
 } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

import { MAINTENANCE_RATE_SET_DATA } from 'redux-main/reducers/modules/material_consumption_rate/materialConsumptionRate';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const materialConsumptionRateSetNewData = (newStateData: { materialConsumptionRateList: MaterialConsumptionRate[] }) => ({
  type: MAINTENANCE_RATE_SET_DATA,
  payload: newStateData,
});

export const materialConsumptionRateGet = (payload: Parameters<typeof getMaterialConsumptionRate>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getMaterialConsumptionRate>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getMaterialConsumptionRate(payload),
    meta,
  )
);

export const materialConsumptionRateCreate = (payload: Parameters<typeof createMaterialConsumptionRate>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createMaterialConsumptionRate>> => async (dispatch) => {
  const newMaterialConsumptionRate = await etsLoadingCounter(
    dispatch,
    createMaterialConsumptionRate(payload),
    meta,
  );

  await materialConsumptionRateGetAndSetInStore({}, meta);
  return newMaterialConsumptionRate;
};

export const materialConsumptionRateGetAndSetInStore = (...arg: Parameters<typeof materialConsumptionRateGet>): EtsAction<EtsActionReturnType<typeof materialConsumptionRateGet>> => async (dispatch) => {
  const result = await dispatch(
    materialConsumptionRateGet(...arg),
  );

  dispatch(
    materialConsumptionRateSetNewData({ materialConsumptionRateList: result.materialConsumptionRateList }),
  );

  return result;
};

export const materialConsumptionRateUpdate = (payload: MaterialConsumptionRate, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateMaterialConsumptionRate>> => async (dispatch) => {
  const materialConsumptionRateUpd = await etsLoadingCounter(
    dispatch,
    updateMaterialConsumptionRate(payload),
    meta,
  );

  await materialConsumptionRateGetAndSetInStore({}, meta);
  return materialConsumptionRateUpd;
};

export const materialConsumptionRateDelete = (id: number, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof deleteMaterialConsumptionRate>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    deleteMaterialConsumptionRate(id),
    meta,
  );
};
