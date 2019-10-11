import {
  getFuelRates,
  createFuelRate,
  updateFuelRate,
  getFuelOperations,
  getFuelRatesByCarModel,
  getEquipmentFuelRatesByCarModel,
} from 'redux-main/reducers/modules/fuel_rates/promises/index';

import {
  FuelRate,
 } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';

import {
  FUEL_RATES_SET_DATA,
  initialState as fuelRatesInitialState,
} from 'redux-main/reducers/modules/fuel_rates/fuelRates';
import { FuelOperation } from '../fuel_operations/@types/fuelOperations';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const fuelRatesSetNewData = (newStateData: Partial<{ fuelRatesList: FuelRate[]; fuelRateOperationsIsActiveList: FuelOperation[] }>) => ({
  type: FUEL_RATES_SET_DATA,
  payload: newStateData,
});

export const fuelRatesGet = (payload: Parameters<typeof getFuelRates>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getFuelRates>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getFuelRates(payload),
    meta,
  )
);

export const fuelRatesGetAndSetInStore = (payload: object = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof fuelRatesGet>> => async (dispatch) => {
  const result = await dispatch(
    fuelRatesGet(payload, meta),
  );

  dispatch(
    fuelRatesSetNewData({ fuelRatesList: result.fuelRatesList }),
  );

  return result;
};

export const fuelRateCreate = (payload: FuelRate, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createFuelRate>> => async (dispatch) => {
  const newFuelRate = await etsLoadingCounter(
    dispatch,
    createFuelRate(payload),
    meta,
  );
  await fuelRatesGetAndSetInStore({}, meta);
  return newFuelRate;
};

export const fuelRateUpdate = (payload: FuelRate, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateFuelRate>> => async (dispatch) => {
  const fuelRateUpd = await etsLoadingCounter(
    dispatch,
    updateFuelRate(payload),
    meta,
  );
  await fuelRatesGetAndSetInStore({}, meta);
  return fuelRateUpd;
};

export const fuelOperationsGet = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getFuelOperations>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getFuelOperations(payload),
    meta,
  )
);

export const resetFuelRates = (): EtsAction<EtsActionReturnType<typeof fuelRatesSetNewData>> => (dispatch) => (
  dispatch(
    fuelRatesSetNewData(fuelRatesInitialState),
  )
);
export const resetFuelOperations = (): EtsAction<EtsActionReturnType<typeof fuelRatesSetNewData>> => (dispatch) => (
  dispatch(
    fuelRatesSetNewData({ fuelRateOperationsIsActiveList: [] }),
  )
);

export const fuelOperationsGetAndSetInStore = (payload: { is_active?: boolean }, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof fuelOperationsGet>>  => async (dispatch) => {
  const result = await dispatch(
    fuelOperationsGet(payload, meta),
  );

  dispatch(
    fuelRatesSetNewData({fuelRateOperationsIsActiveList: result.fuelRateOperations}),
  );

  return result;
};

export const actionLoadFuelRatesByCarModel = (payload: Parameters<typeof getFuelRatesByCarModel>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof getFuelRatesByCarModel>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getFuelRatesByCarModel(payload),
    meta,
  );
};

export const actionLoadEquipmentFuelRatesByCarModel = (payload: Parameters<typeof getEquipmentFuelRatesByCarModel>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof getEquipmentFuelRatesByCarModel>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getEquipmentFuelRatesByCarModel(payload),
    meta,
  );
};
