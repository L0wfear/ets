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
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getRoadAccident = autobaseLoadByType<RoadAccident>(roadAccident);
export const createRoadAccident = autobaseCreateByType<RoadAccident>(roadAccident);
export const updateRoadAccident = autobaseUpdateByType<RoadAccident>(roadAccident);
export const autobaseDeleteRoadAccident = autobaseRemoveByType(roadAccident);

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
