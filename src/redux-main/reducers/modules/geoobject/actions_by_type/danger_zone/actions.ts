import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';

export const actionsDangerZone = defaultActions<Bridges>(
  'geozones/danger_zone',
  makeShape,
);
