import {
  FuelCardsService, FuelCardsArchiveService,
} from 'api/Services';
import { get } from 'lodash';
import { FuelCard } from '../@types/fuelcards.h';
import { createValidDateTime, createValidDate } from '../../../../../../components/@next/@utils/dates/dates';

export const createFuelCard = async (rawFuelCard): Promise<FuelCard> => {
  const payload = {
    ...rawFuelCard,
    fuel_card_on_cars: get(rawFuelCard, 'fuel_card_on_cars', []).map((item) => ({
      ...item,
      car_id: item.car_id,
      installed_at: createValidDate(item.installed_at),
      uninstalled_at: createValidDate(item.uninstalled_at),
    })),
    released_at: createValidDateTime(rawFuelCard.released_at),
  };

  const response = await FuelCardsService.post(
    {...payload},
    false,
    'json',
  );

  return {
    ...rawFuelCard,
    ...get(response, 'result.0', {}),
  };

};

export const updateFuelCard = async (fuelCards): Promise<FuelCard> => {
  const payload = {
    ...fuelCards,
    fuel_card_on_cars: get(fuelCards, 'fuel_card_on_cars', []).map((item) => ({
      ...item,
      car_id: item.car_id,
      installed_at: createValidDate(item.installed_at),
      uninstalled_at: createValidDate(item.uninstalled_at),
    })),
  };

  const response = await FuelCardsService.path(fuelCards.id).put(
    {...payload},
    false,
    'json',
  );

  return {
    ...fuelCards,
    ...get(response, 'result.0', {}),
  };
};

export const getFuelCards = async (payload: any): Promise<{ data: Array<FuelCard>; }> => {
  return FuelCardsService.get({ ...payload })
    .catch((error) => {
      console.info(error); // eslint-disable-line
      return null;
    })
    .then((ans) => ({
      data: get(ans, ['result', 'rows'], []),
    }));
};

export const promiseChangeArchiveStatus = async (id: FuelCard['id'], is_archive: boolean) => {
  await FuelCardsArchiveService.path(id).put({ is_archive }, false, 'json');

  return;
};

export const promiseLoadFuelCardById = async (id: FuelCard['id']) => {
  let response = null;
  try {
    response = await FuelCardsService.path(id).get();
  } catch {
    //
  }

  const result: FuelCard = get(response, 'result.rows.0');

  return result;
};
