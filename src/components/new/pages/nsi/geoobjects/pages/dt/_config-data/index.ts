import permissions from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/dt',
  routePath: `/nsi/geoobjects/dt/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник ДТ',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
