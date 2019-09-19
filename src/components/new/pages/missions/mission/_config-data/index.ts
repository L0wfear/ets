import component from 'components/new/pages/missions/mission/_config-data/components';
import permissions from 'components/new/pages/missions/mission/_config-data/permissions';

import { config } from 'components/new/pages/missions/mission/_config-data/registry-config';

export default {
  path: '/missions/missions',
  routePath: `/missions/missions/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Журнал заданий',
  isNewRegistry: false,
  entyity: 'mission',

  component,
  permissions,
};
