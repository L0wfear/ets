import { HandleThunkActionCreator } from 'react-redux';
import { FuelCard, FuelType } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import {
  createFuelCard,
  updateFuelCard,
  getFuelCards,
  promiseChangeArchiveStatus,
  promiseLoadFuelCardById,
} from 'redux-main/reducers/modules/autobase/fuel_cards/promises';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

/* ---------- FuelCards ---------- */
export const setFuelCards = (fuelCardsList: FuelCard[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      fuelCardsList,
    }),
  )
);

export const setEquipmentFuelCards = (equipmentFuelCardsList: FuelCard[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      equipmentFuelCardsList,
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

export const fuelCardsGet = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof getFuelCards>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getFuelCards(payload),
    meta,
  );
};

export const fuelCardsGetAndSetInStore = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<HandleThunkActionCreator<typeof fuelCardsGet>>> => async (dispatch) => {
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

export const equipmentFuelCardsGetAndSetInStore = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<HandleThunkActionCreator<typeof fuelCardsGet>>> => async (dispatch) => {
  const { data } = await dispatch(
    fuelCardsGet(payload, meta),
  );

  dispatch(
    setEquipmentFuelCards(data),
  );

  return {
    data,
  };
};

export const autobaseCreateFuelCard = (fuelCardsOld: FuelCard, meta: LoadingMeta): EtsAction<ReturnType<typeof createFuelCard>> => async (dispatch) => {
  const fuelCards = await etsLoadingCounter(
    dispatch,
    createFuelCard(fuelCardsOld),
    meta,
  );

  return fuelCards;
};

export const fuelCardsUpdate = (fuelCardsOld: FuelCard, meta: LoadingMeta): EtsAction<ReturnType<typeof updateFuelCard>>  => async (dispatch) => {
  const fuelCards = await etsLoadingCounter(
    dispatch,
    updateFuelCard(fuelCardsOld),
    meta,
  );

  return fuelCards;
};

export const actionFuelCardToArchive = (fuelCardId: FuelCard['id'], meta: LoadingMeta): EtsAction<Promise<void>> => async (dispatch) => {
  await etsLoadingCounter(
    dispatch,
    promiseChangeArchiveStatus(fuelCardId, true),
    meta,
  );
};
export const actionFuelCardFromArchive = (fuelCardId: FuelCard['id'], meta: LoadingMeta): EtsAction<Promise<void>> => async (dispatch) => {
  await etsLoadingCounter(
    dispatch,
    promiseChangeArchiveStatus(fuelCardId, false),
    meta,
  );
};

export const actionLoadFuelCardById = (fuelCardId: FuelCard['id'], meta: LoadingMeta): EtsAction<Promise<FuelCard>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadFuelCardById(fuelCardId),
    meta,
  );
};
