import { createValidDate } from 'components/@next/@utils/dates/dates';
import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { sparePart } from 'redux-main/reducers/modules/autobase/constants';
import { get } from 'lodash';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getSparePart = autobaseLoadByType<SparePart>(sparePart);
export const createSparePart = autobaseCreateByType<SparePart>(sparePart);
export const updateSparePart = autobaseUpdateByType<SparePart>(sparePart);
export const autobaseDeleteSparePart = autobaseRemoveByType(sparePart);

export const createSetSparePart = (rawSparePart) => {
  const payload = {
    ...rawSparePart,
    supplied_at: createValidDate(rawSparePart.supplied_at),
  };

  return createSparePart(
    payload,
  );
};
export const updateSetSparePart = (oldSparePart) => {
  const payload = {
    ...oldSparePart,
    supplied_at: createValidDate(oldSparePart.supplied_at),
    spare_part_to_car: get(oldSparePart, 'spare_part_to_car', []).map((item) => ({
      ...item,
      car_id: item.car_id,
      installed_at: createValidDate(item.installed_at),
      uninstalled_at: createValidDate(item.uninstalled_at),
    })),
  };

  return updateSparePart(
    payload,
  );
};
