import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

import dtActions from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/actions';
import odhActions from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/actions';
import sspActions from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/actions';
import mspActions from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/actions';
import fuelingWaterActions from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/actions';
import carpoolActions from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/actions';
import dangerZoneActions from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/actions';
import pgmStoreActions from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/actions';
import fountainsActions from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/actions';
import bridgesActions from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/actions';
import snowStorageActions from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/actions';

const geoobjectActions = {
  geoobjectSetNewData,
  ...dtActions,
  ...odhActions,
  ...sspActions,
  ...mspActions,
  ...fuelingWaterActions,
  ...carpoolActions,
  ...dangerZoneActions,
  ...pgmStoreActions,
  ...fountainsActions,
  ...bridgesActions,
  ...snowStorageActions,
};

export default geoobjectActions;
