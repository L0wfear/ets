import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

export const actionsPgmStore = defaultActions<PgmStore>(
  'geozones/pgm_store',
  geoobjectSetNewDataNew('pgmStoreList'),
  makeShape,
);
