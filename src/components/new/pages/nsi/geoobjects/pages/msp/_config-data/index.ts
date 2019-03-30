import permissions from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/msp',
  routePath: `/nsi/geoobjects/msp/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник МСП',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
