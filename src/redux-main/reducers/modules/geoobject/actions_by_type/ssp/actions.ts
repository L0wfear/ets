import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';

export const actionsSsp = defaultActions<Ssp>(
  'geozones/ssp',
  geoobjectSetNewDataNew('sspList'),
  makeShape,
);
