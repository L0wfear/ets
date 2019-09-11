import component from 'components/new/pages/missions/mission_template/_config-data/components';
import permissions from 'components/new/pages/missions/mission_template/_config-data/permissions';

import { config } from 'components/new/pages/missions/mission_template/_config-data/registry-config';

export default {
  path: '/missions/mission_templates',
  routePath: `/missions/mission_templates/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Шаблоны заданий',
  isNewRegistry: true,
  entyity: 'mission_template',

  component,
  permissions,
};
