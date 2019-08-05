import {
  autobaseCreateByType,
  autobaseUpdateByType,
  autobaseRemoveByType,
} from 'redux-main/reducers/modules/autobase/promises';
import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { techInspection } from 'redux-main/reducers/modules/autobase/constants';
import { get } from 'lodash';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const getTechInspection = autobaseLoadByType(techInspection);
export const createTechInspection = autobaseCreateByType(techInspection);
export const updateTechInspection = autobaseUpdateByType(techInspection);
export const removeTechInspection = autobaseRemoveByType(techInspection);

export const getSetTechInspection = async (payload) => {
  const { data } = await getTechInspection(payload);

  return {
    data: data.map((rowData) => {
      rowData.files = get(rowData, 'files', []);

      return rowData;
    }),
  };
};

export const createSetTechInspection = (rawTechInspection: TechInspection) => {
  const payload = {
    ...rawTechInspection,
    date_start: createValidDate(rawTechInspection.date_start),
    date_end: createValidDate(rawTechInspection.date_end),
    is_allowed: Boolean(rawTechInspection.is_allowed),
  };

  return createTechInspection(
    payload,
  );
};
export const updateSetTechInspection = (oldTechInspection: TechInspection) => {
  const payload = {
    ...oldTechInspection,
    date_start: createValidDate(oldTechInspection.date_start),
    date_end: createValidDate(oldTechInspection.date_end),
    is_allowed: Boolean(oldTechInspection.is_allowed),
  };

  return updateTechInspection(
    payload,
  );
};
export const autobaseDeleteTechInspection = (id) => {
  return removeTechInspection(
    id,
  );
};
