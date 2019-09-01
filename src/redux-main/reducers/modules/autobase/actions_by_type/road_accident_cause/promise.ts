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
import { RoadAccidentCause } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getSetRoadAccidentCause = autobaseLoadByType<RoadAccidentCause>(roadAccidentCause);
export const createRoadAccidentCause = autobaseCreateByType<RoadAccidentCause>(roadAccidentCause);
export const updateRoadAccidentCause = autobaseUpdateByType<RoadAccidentCause>(roadAccidentCause);
export const autobaseDeleteRoadAccidentCause = autobaseRemoveByType(roadAccidentCause);

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
