import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

export const actionsDangerZone = defaultActions<DangerZone>(
  'geozones/danger_zone',
  geoobjectSetNewDataNew('dangerZoneList'),
  makeShape,
);
