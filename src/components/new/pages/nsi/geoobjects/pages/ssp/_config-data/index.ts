import permissions from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/registry-config';

export default {
  path: '/ssp',
  routePath: `/ssp/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник ССП',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
