import { AutoBase, CarActualService } from 'api/Services';
import { get, keyBy } from 'lodash';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

/* ------------- AUTOBASE ------------- */
export const autobaseLoadByType = <F extends any, ExtraData extends any = any>(keyType: keyof typeof AUTOBASE) => async (payload: object) => {
  let response = null;

  try {
    response = await AutoBase.path(AUTOBASE[keyType]).get({ ...payload });
  } catch {
    //
  }

  const result: {
    data: Array<F>;
    extraData: ExtraData;
  } = {
    data: get(response, 'result.rows', []),
    extraData: get(response, 'result.extra', {}),
  };

  return result;
};

export const autobaseCreateByType = <F extends any>(keyType: keyof typeof AUTOBASE) => async (ownPayload: object) => {
  const payload = {
    ...ownPayload,
  };

  const response = await AutoBase.path(AUTOBASE[keyType]).post(
    payload,
    false,
    'json',
  );

  const data: F = get(
    response,
    'result.rows.0',
    get(response, 'result.0', null),
  );

  return data;
};
export const autobaseUpdateByType = <F extends any>(keyType: keyof typeof AUTOBASE) => async (ownPayload: object & { id: number; }) => {
  const payload = {
    ...ownPayload,
  };

  const response = await AutoBase.path(AUTOBASE[keyType]).path(ownPayload.id).put(
    payload,
    false,
    'json',
  );

  const data: F = get(
    response,
    'result.rows.0',
    get(response, 'result.0', null),
  );

  return data;
};
export const autobaseRemoveByType = (keyType: keyof typeof AUTOBASE) => (id: number) => {
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
    response = await CarActualService.get({ ...payload });
  } catch (error) {
    console.info(error); // eslint-disable-line
  }

  const data: Array<Car> = get(response, ['result', 'rows'], []);

  return {
    data,
    dataIndex: keyBy(
      data,
      'asuods_id',
    ),
  };
};
