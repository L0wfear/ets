import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

export const actionsFountains = defaultActions<Fountains>(
  'gormost/fountains',
  geoobjectSetNewDataNew('fountainsList'),
  makeShape,
);
