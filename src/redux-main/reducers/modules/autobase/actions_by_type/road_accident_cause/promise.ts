import {
  autobaseLoadByType,
} from 'redux-main/reducers/modules/autobase/promises';
import { roadAccidentCause } from 'redux-main/reducers/modules/autobase/constants';
import { RoadAccidentCause } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getSetRoadAccidentCause = autobaseLoadByType<RoadAccidentCause>(roadAccidentCause);
