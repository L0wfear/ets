import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

export const actionsFuelingWater = defaultActions<FuelingWater>(
  'geozones/fueling_water',
  geoobjectSetNewDataNew('fuelingWaterList'),
  makeShape,
);
