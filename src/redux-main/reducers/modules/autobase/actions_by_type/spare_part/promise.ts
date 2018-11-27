import { createValidDate } from 'utils/dates';
import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { sparePart } from 'constants/autobase';

export const getSparePart = autobaseLoadByType(sparePart);
export const createSparePart = autobaseCreateByType(sparePart);
export const updateSparePart = autobaseUpdateByType(sparePart);
export const removeSparePart = autobaseRemoveByType(sparePart);

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
  };

  return updateSparePart(
    payload,
  );
};
export const autobaseDeleteSparePart = (id) => {
  return removeSparePart(
    id,
  );
};
