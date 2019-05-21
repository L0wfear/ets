import {
  FuelCardsService,
} from 'api/Services';
import { get } from 'lodash';
import { FuelCards } from '../@types/fuelcards.h';

export const createFuelCards = async (rawFuelCards) => {
  const payload = {
    ...rawFuelCards,
  };

  const response = await FuelCardsService.post(
    {...payload},
    false,
    'json',
  );

  const fuelCardsRes = get(response, ['result', 0],  null);

  return {
    fuelCardsRes,
  };

};

export const updateFuelCards = async (fuelCards) => {
  const payload = {
    ...fuelCards,
  };

  const response = await FuelCardsService.path(fuelCards.id).put(
    {...payload},
    false,
    'json',
  );

  const fuelCardsRes = get(response, ['result', 0],  null);

  return {
    fuelCardsRes,
  };

};

export const getFuelCards = async (payload: any): Promise<{ data: FuelCards[] }> => {
  return FuelCardsService.get({ ...payload })
    .catch((error) => {
      console.log(error); // tslint:disable-line:no-console
      return null;
    })
    .then((ans) => ({
      data: get(ans, ['result', 'rows'], []),
    }));
};
