import { getChildrenData } from 'utils/routes/getChildrenData';

import odhList from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data';
import dtList from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data';
import sspList from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data';
import mspList from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data';
import fuelingWaterList from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data';

import carpool from 'components/directories/geoobjects/pages/carpool/config-data';

import dangerZonesList from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data';
import pgmStoreList from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data';
import snowStorageList from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data';
import bridgesList from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data';
import pedestrianTunnelsList from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data';
import pedestrianTunnelExitsList from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data';
import fountainsList from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data';

const children = {
  odhList,
  dtList,
  sspList,
  mspList,
  fuelingWaterList,
  carpool,
  dangerZonesList,
  pgmStoreList,
  snowStorageList,
  bridgesList,
  pedestrianTunnelsList,
  pedestrianTunnelExitsList,
  fountainsList,
};

export default {
  title: 'Геообъекты',
  children,
  ...getChildrenData(children),
};
