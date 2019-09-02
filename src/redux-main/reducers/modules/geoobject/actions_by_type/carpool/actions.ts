import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';

export const actionsCarpool = defaultActions<Carpool>(
  'geozones/carpool',
  makeShape,
);
