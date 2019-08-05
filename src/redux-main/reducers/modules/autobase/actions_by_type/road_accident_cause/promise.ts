import { createValidDate } from 'components/@next/@utils/dates/dates';
import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { roadAccidentCause } from 'redux-main/reducers/modules/autobase/constants';
import { get } from 'lodash';

export const getRoadAccidentCause = autobaseLoadByType(roadAccidentCause);
export const createRoadAccidentCause = autobaseCreateByType(roadAccidentCause);
export const updateRoadAccidentCause = autobaseUpdateByType(roadAccidentCause);
export const removeRoadAccidentCause = autobaseRemoveByType(roadAccidentCause);

export const getSetRoadAccidentCause = async (payload) => {
  const { data } = await getRoadAccidentCause(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

export const createSetRoadAccidentCause = (rawRoadAccidentCause) => {
  const payload = {
    ...rawRoadAccidentCause,
    created_at: createValidDate(rawRoadAccidentCause.created_at),
    updated_at: createValidDate(rawRoadAccidentCause.updated_at),
    date_start: createValidDate(rawRoadAccidentCause.date_start),
    date_end: createValidDate(rawRoadAccidentCause.date_end),
  };

  return createRoadAccidentCause(
    payload,
  );
};
export const updateSetRoadAccidentCause = (oldRoadAccidentCause) => {
  const payload = {
    ...oldRoadAccidentCause,
    created_at: createValidDate(oldRoadAccidentCause.created_at),
    updated_at: createValidDate(oldRoadAccidentCause.updated_at),
    date_start: createValidDate(oldRoadAccidentCause.date_start),
    date_end: createValidDate(oldRoadAccidentCause.date_end),
  };

  return updateRoadAccidentCause(
    payload,
  );
};
export const autobaseDeleteRoadAccidentCause = (id) => {
  return removeRoadAccidentCause(
    id,
  );
};
