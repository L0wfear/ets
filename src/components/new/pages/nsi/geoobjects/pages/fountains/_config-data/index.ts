import permissions from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/registry-config';

export default {
  path: '/fountains',
  routePath: `/fountains/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник фонтанов',
  isNewRegistry: true,
  entyity: 'fountains',
  noDotList: false,
  component,
  permissions,
};
