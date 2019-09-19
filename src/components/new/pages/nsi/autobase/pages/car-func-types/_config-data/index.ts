import permissions from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data/components';

import { config } from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data/registry-config';

export default {
  path: '/nsi/autobase/types',
  routePath: `/nsi/autobase/types/:${config.list.data.uniqKeyForParams}?`,
  title: 'Типы техники',
  isNewRegistry: false,
  entyity: 'type',

  component,
  permissions,
};
