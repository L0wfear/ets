import { AutoBase, CarService, TypesService } from 'api/Services';
import { get } from 'lodash';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';

/* ------------- AUTOBASE ------------- */
export const autobaseLoadByType = (keyType: keyof typeof AUTOBASE) => (payload = {}) => (
  AutoBase.path(AUTOBASE[keyType]).get({ ...payload })
    .catch((error) => {
      console.log(error); // tslint:disable-line:no-console
    })
    .then((ans) => ({
      data: get(ans, ['result', 'rows'], []),
      extraData: get(ans, ['result', 'extra'], {}),
    }))
);
export const autobaseCreateByType = (keyType: keyof typeof AUTOBASE) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return AutoBase.path(AUTOBASE[keyType]).post(
    payload,
    false,
    'json',
  );
};
export const autobaseUpdateByType = (keyType: keyof typeof AUTOBASE) => (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  return AutoBase.path(AUTOBASE[keyType]).path(ownPayload.id).put(
    payload,
    false,
    'json',
  );
};
export const autobaseRemoveByType = (keyType: keyof typeof AUTOBASE) => (id) => {
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
      console.log(error); // tslint:disable-line:no-console

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
export const autobaseUpdateCar = (ownPayload) => {
  return Promise.reject();
};

/* ------------- CAR_FUNC_TYPES ------------- */
export const autobaseLoadCarFuncTypess = (payload = {}) => (
  TypesService.get({ ...payload })
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
    }))
);
export const autobaseCreateCarFuncTypes = (ownPayload) => {
  return TypesService.post(ownPayload, false, 'json');
};
export const autobaseUpdateCarFuncTypes = (ownPayload) => {
  return TypesService.put(ownPayload, false, 'json');
};
