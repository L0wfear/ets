import permissions from 'components/new/pages/nsi/company_structure/_config-data/permissions';
import component from 'components/new/pages/nsi/company_structure/_config-data/components';

import { config } from 'components/new/pages/nsi/company_structure/_config-data/registry-config';

export default {
  path: '/nsi/company_structure',
  routePath: `/nsi/company_structure/:${config.list.data.uniqKeyForParams}?`,
  title: 'Структура предприятия',
  isNewRegistry: false,
  entyity: 'company_structure',

  component,
  permissions,
};
