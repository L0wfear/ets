import permissions from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/registry-config';

export default {
  path: '/danger_zone',
  routePath: `/danger_zone/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник особо опасных мест',
  isNewRegistry: true,
  entyity: 'danger_zone',
  noDotList: false,
  component,
  permissions,
};
