import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { carCategory } from 'redux-main/reducers/modules/autobase/constants';

export const createCarCategory = autobaseCreateByType(carCategory);
export const updateCarCategory = autobaseUpdateByType(carCategory);
export const removeCarCategory = autobaseRemoveByType(carCategory);

export const createSetCarCategory = (rawCarCategory) => {
  const payload = {
    ...rawCarCategory,
  };

  return createCarCategory(
    payload,
  );
};
export const updateSetCarCategory = (oldCarCategory) => {
  const payload = {
    ...oldCarCategory,
  };

  return updateCarCategory(
    payload,
  );
};
export const autobaseDeleteCarCategory = (id) => {
  return removeCarCategory(
    id,
  );
};
