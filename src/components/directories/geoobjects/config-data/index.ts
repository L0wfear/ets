import { getChildrenData } from 'utils/routes/getChildrenData';

import dangerZones from 'components/directories/geoobjects/pages/danger_zones/config-data';
import pgm from 'components/directories/geoobjects/pages/pgm/config-data';
import snowStorage from 'components/directories/geoobjects/pages/snow_storage/config-data';
import bridges from 'components/directories/geoobjects/pages/bridges/config-data';
import pedestrianTunnels from 'components/directories/geoobjects/pages/pedestrian_tunnels/config-data';
import pedestrianTunnelExits from 'components/directories/geoobjects/pages/pedestrian_tunnel_exits/config-data';
import fountains from 'components/directories/geoobjects/pages/fountains/config-data';

import odhList from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data';
import dtList from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data';
import mspList from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data';
import sspList from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data';
import fuelingWater from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data';
import carpool from 'components/directories/geoobjects/pages/carpool/config-data';

const children = {
  odhList,
  dtList,
  sspList,
  mspList,
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
