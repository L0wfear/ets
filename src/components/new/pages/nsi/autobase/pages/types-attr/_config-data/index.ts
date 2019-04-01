import permissions from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/components';

import { config } from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/registry-config';

export default {
  path: '/nsi/autobase/types_attr',
  routePath: `/nsi/autobase/types_attr/:${config}?`,
  title: 'Таблица нормативных скоростей и ширин',
  isNewRegistry: true,
  entyity: 'types_attr',
  noDotList: false,
  component,
  permissions,
};
