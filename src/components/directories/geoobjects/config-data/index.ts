import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import odh from 'components/directories/geoobjects/odh/config-data';
import dt from 'components/directories/geoobjects/dt/config-data';
import ssp from 'components/directories/geoobjects/ssp/config-data';
import msp from 'components/directories/geoobjects/msp/config-data';
import fuelingWater from 'components/directories/geoobjects/fueling_water/config-data';
import carpool from 'components/directories/geoobjects/carpool/config-data';
import dangerZones from 'components/directories/geoobjects/danger_zones/config-data';
import pgm from 'components/directories/geoobjects/pgm/config-data';
import snowStorage from 'components/directories/geoobjects/snow_storage/config-data';
import bridges from 'components/directories/geoobjects/bridges/config-data';
import pedestrianTunnels from 'components/directories/geoobjects/pedestrian_tunnels/config-data';
import pedestrianTunnelExits from 'components/directories/geoobjects/pedestrian_tunnel_exits/config-data';
import fountains from 'components/directories/geoobjects/fountains/config-data';

const children = {
  odh,
  dt,
  ssp,
  msp,
  fuelingWater,
  carpool,
  dangerZones,
  pgm,
  snowStorage,
  bridges,
  pedestrianTunnels,
  pedestrianTunnelExits,
  fountains,
};

export default {
  title: 'Геообъекты',
  children,
  permissions: getChildrenPermissions(children),
};
