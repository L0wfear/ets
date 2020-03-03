import permissions from 'components/new/pages/nsi/norm_registry/_config-data/permissions';
import component from 'components/new/pages/nsi/norm_registry/_config-data/components';

import { config } from 'components/new/pages/nsi/norm_registry/_config-data/registry-config';

export default {
  path: '/nsi/norm_registry',
  routePath: `/nsi/norm_registry/:${config.list.data.uniqKeyForParams}?`,
  title: 'Реестр технологических операций',
  isNewRegistry: true,
  entyity: 'technical_operation',

  component,
  permissions,
};
