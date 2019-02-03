import permissions from 'components/new/pages/nsi/company/_config-data/permissions';
import component from 'components/new/pages/nsi/company/_config-data/components';

export default {
  path: '/companies', // /company
  title: 'Реестр организаций',
  entyity: 'company',
  noDotList: false,
  component,
  permissions,
};
