import permissions from 'components/new/pages/administration/services/_config-data/permissions';
import component from 'components/new/pages/administration/services/_config-data/components';
import { config } from 'components/new/pages/administration/services/_config-data/registry-config';

export default {
  path: '/administration/services',
  routePath: `/administration/services/:${config.list.data.uniqKeyForParams}?`,
  title: 'Управление сервисами',
  isNewRegistry: true,
  entyity: 'services',
  noDotList: false,
  component,
  permissions,
};
