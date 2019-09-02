import { defaultActions } from 'redux-main/default.actions';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';

export const actionsMsp = defaultActions<Msp>(
  'geozones/msp',
  makeShape,
);
