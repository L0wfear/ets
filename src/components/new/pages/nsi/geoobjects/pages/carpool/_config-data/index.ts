import permissions from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/registry-config';

export default {
  path: '/carpool',
  routePath: `/carpool/:${config.list.data.uniqKeyForParams}?`,
  isNewRegistry: true,
  title: 'Справочник Автобаз',
  entyity: 'carpool',
  noDotList: false,
  component,
  permissions,
};
