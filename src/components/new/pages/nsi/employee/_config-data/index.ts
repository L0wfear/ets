import permissions from 'components/new/pages/nsi/employee/_config-data/permissions';
import component from 'components/new/pages/nsi/employee/_config-data/components';

import { config } from 'components/new/pages/nsi/employee/_config-data/registry-config';

export default {
  path: '/nsi/employees',
  routePath: `/nsi/employees/:${config.list.data.uniqKeyForParams}?`,
  title: 'Реестр сотрудников',
  isNewRegistry: true,
  entyity: 'employee',
  noDotList: false,
  component,
  permissions,
};
