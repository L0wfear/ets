import { AutoBase, CarService, TypesService } from 'api/Services';
import { get, keyBy } from 'lodash';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

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
export const autobaseCreateByType = (keyType: keyof typeof AUTOBASE) => async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await AutoBase.path(AUTOBASE[keyType]).post(
    payload,
    false,
    'json',
  );

  const data = get(
    response,
    ['result', 'rows', 0],
    get(response, ['result', 0], null),
  );

  return data;
};
export const autobaseUpdateByType = (keyType: keyof typeof AUTOBASE) => async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await AutoBase.path(AUTOBASE[keyType]).path(ownPayload.id).put(
    payload,
    false,
    'json',
  );

  const data = get(
    response,
    ['result', 'rows', 0],
    get(response, ['result', 0], null),
  );

  return data;
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
export const autobaseLoadCars = async (payload = {}) => {
  let response = null;

  try {
    response = await CarService.get({ ...payload });
  } catch (error) {
    console.log(error); // tslint:disable-line:no-console
  }

  const data: Car[] = get(response, ['result', 'rows'], []);

  return {
    data,
    dataIndex: keyBy(
      data,
      'asuods_id',
    ),
  };
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
