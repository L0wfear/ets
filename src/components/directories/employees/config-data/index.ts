import permissions from 'components/directories/employees/config-data/permissions';
import component from 'components/directories/employees/config-data/components';

export default {
  path: '/employees',
  title: 'Реестр сотрудников',
  entyity: 'employee',
  noDotList: false,
  component,
  permissions,
};
