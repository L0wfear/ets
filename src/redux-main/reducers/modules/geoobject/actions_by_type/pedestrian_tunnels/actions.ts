import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

export const actionsPedestrianTunnels = defaultActions<Fountains>(
  'gormost/pedestrian_tunnels',
  makeShape,
);
