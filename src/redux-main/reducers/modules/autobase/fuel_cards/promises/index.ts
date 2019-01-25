import {
  FuelCards,
  FuelTypeService,
} from 'api/Services';
import { get } from 'lodash';

export const createFuelCards = (rawFuelCards) => {
  const payload = {
    ...rawFuelCards,
  };
  // Если выбрана опция "Налив", то при PUT и POST запросах топливную карту надо отправлять как null
  return FuelCards.post(
    payload,
    false,
    'json',
  );
};

export const updateFuelCards = (fuelCards) => {
  const payload = {
    ...fuelCards,
  };
  // {
  //   "number": "ТЕСТ23",
  //   "fuel_type": "DT",
  //   "company_id": 10227244
  // }
  // Если выбрана опция "Налив", то при PUT и POST запросах топливную карту надо отправлять как null
  return FuelCards.path(fuelCards.id).put(
    payload,
    false,
    'json',
  );
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

export const getFuelTypeService = (payload) => FuelTypeService.get({ ...payload })
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
