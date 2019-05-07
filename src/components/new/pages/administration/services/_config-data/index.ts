import permissions from 'components/new/pages/administration/services/_config-data/permissions';
import component from 'components/new/pages/administration/services/_config-data/components';

export default {
  path: '/administration/services',
  routePath: `/administration/services`,
  title: 'Управление сервисами',
  isNewRegistry: true,
  entyity: 'services',
  noDotList: false,
  component,
  permissions,
};
