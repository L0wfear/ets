import permissions from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/bridges',
  routePath: `/nsi/geoobjects/bridges/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник мостов',
  isNewRegistry: false,
  entyity: 'bridges',

  component,
  permissions,
};
