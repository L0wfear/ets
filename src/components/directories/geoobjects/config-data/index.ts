import { getChildrenData } from 'utils/routes/getChildrenData';

import odh from 'components/directories/geoobjects/pages/odh/config-data';
import dt from 'components/directories/geoobjects/pages/dt/config-data';
import ssp from 'components/directories/geoobjects/pages/ssp/config-data';
import msp from 'components/directories/geoobjects/pages/msp/config-data';
import fuelingWater from 'components/directories/geoobjects/pages/fueling_water/config-data';
import dangerZones from 'components/directories/geoobjects/pages/danger_zones/config-data';
import pgm from 'components/directories/geoobjects/pages/pgm/config-data';
import snowStorage from 'components/directories/geoobjects/pages/snow_storage/config-data';
import bridges from 'components/directories/geoobjects/pages/bridges/config-data';
import pedestrianTunnels from 'components/directories/geoobjects/pages/pedestrian_tunnels/config-data';
import pedestrianTunnelExits from 'components/directories/geoobjects/pages/pedestrian_tunnel_exits/config-data';
import fountains from 'components/directories/geoobjects/pages/fountains/config-data';

import carpool from 'components/directories/geoobjects/pages/carpool/config-data';

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
  ...getChildrenData(children),
};
