import { AutoBase, CarService } from 'api/Services';
import { get } from 'lodash';
import AUTOBASE from 'constants/autobase';

/* ------------- AUTOBASE ------------- */
export const autobaseLoadByType = (keyType) => (payload = {}) => (
  AutoBase.path(AUTOBASE[keyType]).get({ ...payload })
    .catch((error) => {
      // tslint:disable-next-line
      console.log(error);

      return {
        result: {
          rows: [],
        },
      };
    })
    .then((ans) => ({
      data: get(ans, ['result', 'rows'], []),
    }))
);
export const autobaseCreateByType = (keyType) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return AutoBase.path(AUTOBASE[keyType]).post(
    payload,
    false,
    'json',
  );
};
export const autobaseUpdateByType = (keyType) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return AutoBase.path(AUTOBASE[keyType]).path(ownPayload.id).put(
    payload,
    false,
    'json',
  );
};
export const autobaseRemoveByType = (keyType) => (id) => {
  return AutoBase.path(`${AUTOBASE[keyType]}/${id}`).delete(
    {},
    false,
    'json',
  ).then(() => {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  });
};

/* ------------- CARS ------------- */
export const autobaseLoadCars = (payload = {}) => (
  CarService.get({ ...payload })
    .catch((error) => {
      // tslint:disable-next-line
      console.log(error);

      return {
        result: {
          rows: [],
        },
      };
    })
    .then((ans) => ({
      data: get(ans, ['result', 'rows'], []),
    }))
);
export const autobaseUpdateCar = (keyType) => (ownPayload) => {
  return Promise.reject();
};
