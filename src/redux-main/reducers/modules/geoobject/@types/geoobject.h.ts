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
  carpoolList: Carpool[];
  dtList: Dt[];
  dtPolys: Record<Dt['yard_id'], Dt>;
  odhList: Odh[];
  sspList: Ssp[];
  mspList: Msp[]
  fuelingWaterList: FuelingWater[];
  fountainsList: Fountains[];
  bridgesList: Bridges[];
  dangerZoneList: DangerZone[];
  pgmStoreList: PgmStore[];
  snowStorageList: SnowStorage[];
  pedestrianTunnelsList: PedestrianTunnels[];
  pedestrianTunnelExitsList: PedestrianTunnelExits[];
};
