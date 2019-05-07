import component from 'components/new/pages/waybill/_config-data/components';
import permissions from 'components/new/pages/waybill/_config-data/permissions';

import { config } from 'components/new/pages/waybill/_config-data/registry-config';

export default {
  path: '/waybills',
  routePath: `/waybills/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Путевые листы',
  isNewRegistry: true,
  entyity: 'waybill',
  noDotList: false,
  component,
  permissions,
};
