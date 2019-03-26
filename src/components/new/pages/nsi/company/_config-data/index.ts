import permissions from 'components/new/pages/nsi/company/_config-data/permissions';
import component from 'components/new/pages/nsi/company/_config-data/components';

export default {
  path: '/companies', // /company
  routePath: '/companies/:company_id?',
  title: 'Реестр организаций',
  isNewRegistry: true,
  entyity: 'company',
  noDotList: false,
  component,
  permissions,
};
