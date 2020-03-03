import component from 'components/new/pages/missions/duty_mission/_config-data/components';
import permissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';

import { config } from 'components/new/pages/missions/duty_mission/_config-data/registry-config';

export default {
  path: '/missions/duty_missions',
  routePath: `/missions/duty_missions/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Журнал наряд-заданий',
  isNewRegistry: false,
  entyity: 'duty_mission',

  component,
  permissions,
};
