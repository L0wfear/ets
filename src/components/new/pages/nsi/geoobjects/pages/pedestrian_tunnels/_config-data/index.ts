import permissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/pedestrian_tunnels',
  routePath: `/nsi/geoobjects/pedestrian_tunnels/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник пешеходных тоннелей',
  isNewRegistry: false,
  entyity: 'pedestrian_tunnels',

  component,
  permissions,
};
