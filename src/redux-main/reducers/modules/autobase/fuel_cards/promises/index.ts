import {
  FuelCards,
} from 'api/Services';
import { get } from 'lodash';

export const createFuelCards = async (rawFuelCards) => {
  const payload = {
    ...rawFuelCards,
  };

  const response = await FuelCards.post(
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

  const response = await FuelCards.path(fuelCards.id).put(
    {...payload},
    false,
    'json',
  );

  const fuelCardsRes = get(response, ['result', 0],  null);

  return {
    fuelCardsRes,
  };

};

export const getFuelCards = (payload) => FuelCards.get({ ...payload })
  .catch((error) => {
    console.log(error); // tslint:disable-line:no-console
    return {
      result: {
        rows: [],
      },
    };
  })
  .then((ans) => ({
    data: get(ans, ['result', 'rows'], []),
  }));
