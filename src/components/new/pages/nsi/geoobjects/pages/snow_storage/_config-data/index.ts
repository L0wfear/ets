import permissions from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/snow_storage',
  routePath: `/nsi/geoobjects/snow_storage/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник пунктов временного складирования снега',
  isNewRegistry: true,
  entyity: 'snow_storage',

  component,
  permissions,
};
