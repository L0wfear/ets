import {
  FuelCardsService,
} from 'api/Services';
import { get } from 'lodash';
import { FuelCard } from '../@types/fuelcards.h';

export const createFuelCard = async (rawFuelCard): Promise<FuelCard> => {
  const payload = {
    ...rawFuelCard,
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

export const getFuelCards = async (payload: any): Promise<{ data: FuelCard[] }> => {
  return FuelCardsService.get({ ...payload })
    .catch((error) => {
      console.log(error); // tslint:disable-line:no-console
      return null;
    })
    .then((ans) => ({
      data: get(ans, ['result', 'rows'], []),
    }));
};
