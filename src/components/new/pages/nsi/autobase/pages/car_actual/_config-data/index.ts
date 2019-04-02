import permissions from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/components';

import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';

export default {
  path: '/nsi/autobase/car_actual',
  routePath: `/nsi/autobase/car_actual/:${config.list.data.uniqKeyForParams}?/:tabKey?`,
  title: 'Реестр транспортных средств',
  isNewRegistry: true,
  entyity: 'car',
  noDotList: false,
  component,
  permissions,
};
