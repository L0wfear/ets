import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { promiseLoadFuelTypes, promiseLoadFuelTypeById } from './promise';
import { FuelTypes, FuelTypesId } from './@types';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionSetFuelTypes = (fuelTypesList: Array<FuelTypes>): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      fuelTypesList,
    }),
  )
);
export const actionResetSetFuelTypes = (): EtsAction<EtsActionReturnType<typeof actionSetFuelTypes>> => (dispatch) => (
  dispatch(
    actionSetFuelTypes([]),
  )
);
export const actionLoadFuelTypes = (payload: Parameters<typeof promiseLoadFuelTypes>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadFuelTypes>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadFuelTypes(payload),
    meta,
  );
};

export const actionLoadFuelTypeById = (id: FuelTypesId, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadFuelTypes>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadFuelTypeById(id),
    meta,
  );
};

export const actionFuelTypesGetAndSetInStore = (...arg: Parameters<typeof actionLoadFuelTypes>): EtsAction<EtsActionReturnType<typeof actionLoadFuelTypes>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadFuelTypes(...arg),
  );

  dispatch(
    actionSetFuelTypes(result.data),
  );

  return result;
};

export const actionFuelTypesByIdGetAndSetInStore = (...arg: Parameters<typeof actionLoadFuelTypeById>): EtsAction<EtsActionReturnType<typeof actionLoadFuelTypes>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadFuelTypeById(...arg),
  );

  dispatch(
    actionSetFuelTypes(result.data),
  );

  return result;
};
