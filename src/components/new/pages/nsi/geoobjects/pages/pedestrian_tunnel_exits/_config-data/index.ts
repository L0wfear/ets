import permissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/pedestrian_tunnel_exits',
  routePath: `/nsi/geoobjects/pedestrian_tunnel_exits/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник выходов из пешеходных тоннелей',
  isNewRegistry: true,
  entyity: 'pedestrian_tunnel_exits',
  noDotList: false,
  component,
  permissions,
};
