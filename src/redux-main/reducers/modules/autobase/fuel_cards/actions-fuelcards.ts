import { FuelCard, FuelType } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import {
  createFuelCard,
  updateFuelCard,
  getFuelCards,
} from 'redux-main/reducers/modules/autobase/fuel_cards/promises';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { HandleThunkActionCreator } from 'react-redux';

/* ---------- FuelCards ---------- */
export const setFuelCards = (fuelCardsList: FuelCard[]) => (dispatch) => (
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

export const fuelCardsGet = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof getFuelCards>, ReduxState, {}, AnyAction> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getFuelCards(payload),
    meta,
  );
};

export const fuelCardsGetAndSetInStore = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof fuelCardsGet>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { data } = await dispatch(
    fuelCardsGet(payload, meta),
  );

  dispatch(
    setFuelCards(data),
  );

  return {
    data,
  };
};

export const autobaseCreateFuelCard = (fuelCardsOld: FuelCard, meta: LoadingMeta): ThunkAction<ReturnType<typeof createFuelCard>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const fuelCards = await etsLoadingCounter(
    dispatch,
    createFuelCard(fuelCardsOld),
    meta,
  );

  return fuelCards;
};

export const fuelCardsUpdate = (fuelCardsOld: FuelCard, meta: LoadingMeta): ThunkAction<ReturnType<typeof updateFuelCard>, ReduxState, {}, AnyAction>  => async (dispatch) => {
  const fuelCards = await etsLoadingCounter(
    dispatch,
    updateFuelCard(fuelCardsOld),
    meta,
  );

  return fuelCards;
};
