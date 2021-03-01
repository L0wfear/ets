import permissions from 'components/new/pages/nsi/user_acces/_config-data/permissions';
import component from 'components/new/pages/nsi/user_acces/_config-data/components';

import { config } from 'components/new/pages/nsi/user_acces/_config-data/registry-config';

export default {
  path: '/nsi/users_access',
  routePath: `/nsi/users_access/:${config.list.data.uniqKeyForParams}?`,
  title: 'Реестр настройки доступов',
  isNewRegistry: false,
  entyity: 'users_access',

  component,
  permissions,
};
