import permissions from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data/permissions';
import component from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data/components';

import { config } from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data/registry-config';

export default {
  path: '/car-func-types',
  routePath: `/car-func-types/:${config.list.data.uniqKeyForParams}?`,
  title: 'Типы техники',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
