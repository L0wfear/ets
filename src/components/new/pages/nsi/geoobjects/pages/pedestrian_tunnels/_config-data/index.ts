import permissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/components';

export default {
  path: '/pedestrian_tunnels',
  routePath: '/pedestrian_tunnels/:id?',
  title: 'Справочник пешеходных тоннелей',
  isNewRegistry: true,
  entyity: 'pedestrian_tunnels',
  noDotList: false,
  component,
  permissions,
};
