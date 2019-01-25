import { FuelCards, FuelType } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import {
  createFuelCards,
  updateFuelCards,
  getFuelCards,
  getFuelTypeService,
} from 'redux-main/reducers/modules/autobase/fuel_cards/promises';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';

/* ---------- FuelCards ---------- */
export const setFuelCards = (fuelCardsList: FuelCards[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      fuelCardsList,
    }),
  )
);

export const setFuelType = (fuelTypeList: FuelType[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      fuelTypeList,
    }),
  )
);

export const resetSetFuelCards = () => (dispatch) => (
  dispatch(
    setFuelCards([]),
  )
);

export const fuelCardsGet = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getFuelCards(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export const fuelCardsGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    fuelCardsGet(payload, { page, path }),
  );

  dispatch(
    setFuelCards(data),
  );

  return {
    fuelCardsList: data,
  };
};

export const autobaseCreateFuelCards: any = (fuelCardsOld: FuelCards, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { fuelCards } } = await dispatch({
    type: 'none',
    payload: createFuelCards(fuelCardsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return fuelCards;
};

export const fuelCardsUpdate: any = (fuelCardsOld: FuelCards, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { fuelCards } } = await dispatch({
    type: 'none',
    payload: updateFuelCards(fuelCardsOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return fuelCards;
};

export const fuelTypeGet: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getFuelTypeService(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

export const fuelTypeGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    fuelTypeGet(payload, { page, path }),
  );

  dispatch(
    setFuelType(data),
  );

  return {
    fuelTypeList: data,
  };
};
