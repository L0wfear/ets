import permissions from 'components/new/pages/nsi/employee/_config-data/permissions';
import component from 'components/new/pages/nsi/employee/_config-data/components';

export default {
  path: '/nsi/employees',
  routePath: '/nsi/employees/:id?',
  title: 'Реестр сотрудников',
  isNewRegistry: true,
  entyity: 'employee',
  noDotList: false,
  component,
  permissions,
};
