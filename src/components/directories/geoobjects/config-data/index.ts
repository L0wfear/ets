import { getChildrenData } from 'utils/routes/getChildrenData';

import dangerZones from 'components/directories/geoobjects/pages/danger_zones/config-data';
import pgm from 'components/directories/geoobjects/pages/pgm/config-data';
import snowStorage from 'components/directories/geoobjects/pages/snow_storage/config-data';
import pedestrianTunnels from 'components/directories/geoobjects/pages/pedestrian_tunnels/config-data';
import pedestrianTunnelExits from 'components/directories/geoobjects/pages/pedestrian_tunnel_exits/config-data';

import carpool from 'components/directories/geoobjects/pages/carpool/config-data';

import odhList from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data';
import dtList from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data';
import mspList from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data';
import sspList from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data';
import fuelingWaterList from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data';
import fountainsList from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data';
import bridgesList from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data';

const children = {
  odhList,
  dtList,
  sspList,
  mspList,
  fuelingWaterList,
  carpool,
  dangerZones,
  pgm,
  snowStorage,
  bridgesList,
  pedestrianTunnels,
  pedestrianTunnelExits,
  fountainsList,
};

export default {
  title: 'Геообъекты',
  children,
  ...getChildrenData(children),
};
