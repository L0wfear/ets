import permissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/components';

export default {
  path: '/pedestrian_tunnel_exits',
  routePath: '/pedestrian_tunnel_exits/:id?',
  title: 'Справочник выходов из пешеходных тоннелей',
  isNewRegistry: true,
  entyity: 'pedestrian_tunnel_exits',
  noDotList: false,
  component,
  permissions,
};
