import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { tire, tireNoRegistry } from 'redux-main/reducers/modules/autobase/constants';
import { tireToCarMap } from 'redux-main/reducers/modules/autobase/actions_by_type/tire/utils';
import { createValidDate } from 'utils/dates';
import { get } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from 'redux-main/reducers/modules/autobase/constants';

export const getTire = autobaseLoadByType(tire);
export const createTire = autobaseCreateByType(tireNoRegistry);
export const updateTire = autobaseUpdateByType(tire);
export const removeTire = autobaseRemoveByType(tire);

export const getSetTire = async (...payload) => {
  const { data } = await getTire(...payload);

  return {
    data: data.map(tireToCarMap),
  };
};

export const createSetTire = (rawTire) => {
  const payload = {
    ...rawTire,
    battery_to_car: get(rawTire, 'battery_to_car', []).map((item) => ({
      car_id: item.car_id,
      installed_at: createValidDate(item.installed_at),
      uninstalled_at: createValidDate(item.uninstalled_at),
    })),
    released_at: createValidDate(rawTire.released_at),
  };

  return createTire(
    payload,
  );
};
export const cloneSetTire = async (tireId) => {
  const response = await AutoBase.path(AUTOBASE[tire]).path(tireId).path('copy').post(
    {},
    false,
    'json',
  );

  const data = get(response, ['result', 'rows', 0], null);

  return data;
};

export const updateSetTire = (oldTire) => {
  const payload = {
    ...oldTire,
    battery_to_car: get(oldTire, 'battery_to_car', []).map((item) => ({
      car_id: item.car_id,
      installed_at: createValidDate(item.installed_at),
      uninstalled_at: createValidDate(item.uninstalled_at),
    })),
    released_at: createValidDate(oldTire.released_at),
  };

  return updateTire(
    payload,
  );
};
export const autobaseDeleteTire = (id) => {
  return removeTire(
    id,
  );
};
