import permissions from 'components/new/pages/nsi/company/_config-data/permissions';
import component from 'components/new/pages/nsi/company/_config-data/components';

import { config } from 'components/new/pages/nsi/company/_config-data/registry-config';

export default {
  path: '/nsi/companies', // /company
  routePath: `/nsi/companies/:${config.list.data.uniqKeyForParams}?`,
  title: 'Реестр организаций',
  isNewRegistry: false,
  entyity: 'company',

  component,
  permissions,
};
