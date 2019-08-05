import { createValidDate } from 'components/@next/@utils/dates/dates';
import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { roadAccident } from 'redux-main/reducers/modules/autobase/constants';
import { get } from 'lodash';

export const getRoadAccident = autobaseLoadByType(roadAccident);
export const createRoadAccident = autobaseCreateByType(roadAccident);
export const updateRoadAccident = autobaseUpdateByType(roadAccident);
export const removeRoadAccident = autobaseRemoveByType(roadAccident);

export const getSetRoadAccident = async (payload) => {
  const { data } = await getRoadAccident(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

export const createSetRoadAccident = (rawRoadAccident) => {
  const payload = {
    ...rawRoadAccident,
    accident_date: createValidDate(rawRoadAccident.accident_date),
  };

  return createRoadAccident(
    payload,
  );
};
export const updateSetRoadAccident = (oldRoadAccident) => {
  const payload = {
    ...oldRoadAccident,
    accident_date: createValidDate(oldRoadAccident.accident_date),
  };

  return updateRoadAccident(
    payload,
  );
};
export const autobaseDeleteRoadAccident = (id) => {
  return removeRoadAccident(
    id,
  );
};
