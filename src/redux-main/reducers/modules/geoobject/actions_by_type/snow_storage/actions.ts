import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';
import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

export const actionsSnowStorage = defaultActions<SnowStorage>(
  'geozones/snow_storage',
  geoobjectSetNewDataNew('snowStorageList'),
  makeShape,
);
