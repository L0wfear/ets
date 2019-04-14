import {
  getFuelRates,
  getFuelRatesByCarModel,
  getEquipmentFuelRatesByCarModel,
  createFuelRate,
  updateFuelRate,
  deleteFuelRate,
  getFuelOperations,
} from 'redux-main/reducers/modules/fuel_rates/promises/index';

import {
  IFuelRatesByCarModel,
  IEquipmentFuelRatesByCarModel,
  FuelRate,
 } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';

import {
  FUEL_RATES_SET_DATA,
  initialState as fuelRatesInitialState,
} from 'redux-main/reducers/modules/fuel_rates/fuelRates';
import { FuelOperation } from '../fuel_operations/@types/fuelOperations';

export const fuelRatesGet = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getFuelRates(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export const fuelRatesSetNewData = (newStateData) => ({
  type: FUEL_RATES_SET_DATA,
  payload: newStateData,
});

export const fuelRatesGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { fuelRatesList } } = await dispatch(
    fuelRatesGet(payload, { page, path, }),
  );

  dispatch(
    fuelRatesSetNewData({fuelRatesList}),
  );

  return {
    fuelRatesList,
  };
};

export const fuelRatesByCarModelGet = ( payload: IFuelRatesByCarModel) => ({
  type: 'none',
  payload: getFuelRatesByCarModel(payload),
  meta: {
    promise: true,
  },
});

export const equipmentFuelRatesByCarModelGet = (payload: IEquipmentFuelRatesByCarModel) => ({
  type: 'none',
  payload: getEquipmentFuelRatesByCarModel(payload),
  meta: {
    promise: true,
  },
});

export const fuelRateCreate: any = (payload: FuelRate, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const newFuelRate = await dispatch({
    type: 'none',
    payload: createFuelRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
  await fuelRatesGetAndSetInStore({}, {page, path});
  return newFuelRate;
};

export const fuelRateUpdate: any = (payload: FuelRate, { page, path }: {page: string, path?: string }) => async (dispatch) => {
  const fuelRateUpd = await dispatch({
    type: 'none',
    payload: updateFuelRate(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
  await fuelRatesGetAndSetInStore({}, {page, path});
  return fuelRateUpd;
};

export const fuelRateDelete = (payload: number) => ({
  type: 'none',
  payload: deleteFuelRate(payload),
  meta: {
    promise: true,
  },
});

export const fuelOperationsGet = (payload, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getFuelOperations(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export const resetFuelRates = () => (dispatch) => (
  dispatch(
    fuelRatesSetNewData(fuelRatesInitialState),
  )
);
export const resetFuelOperations = () => (dispatch) => (
  dispatch(
    fuelRatesSetNewData({fuelRateOperationsIsActiveList: []}),
  )
);

export const fuelOperationsGetAndSetInStore: any = (payload: FuelOperation, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { fuelRateOperations } } = await dispatch(
    fuelOperationsGet(payload, { page, path, }),
  );

  dispatch(
    fuelRatesSetNewData({fuelRateOperationsIsActiveList: fuelRateOperations}),
  );

  return {
    fuelRateOperations,
  };
};
