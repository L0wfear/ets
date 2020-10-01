import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';

export type IStateGeoobject = {
  carpoolList: Array<Carpool>;
  dtList: Array<Dt>;
  dtPolys: Record<Dt['yard_id'], Dt>;
  odhList: Array<Odh>;
  sspList: Array<Ssp>;
  mspList: Array<Msp>;
  fuelingWaterList: Array<FuelingWater>;
  fountainsList: Array<Fountains>;
  bridgesList: Array<Bridges>;
  dangerZoneList: Array<DangerZone>;
  pgmStoreList: Array<PgmStore>;
  snowStorageList: Array<SnowStorage>;
  pedestrianTunnelsList: Array<PedestrianTunnels>;
  pedestrianTunnelExitsList: Array<PedestrianTunnelExits>;
};

export type GeoobjsFilterByElemOptions = {
  object_type_id: number;
  municipal_facility_id: number;
};
