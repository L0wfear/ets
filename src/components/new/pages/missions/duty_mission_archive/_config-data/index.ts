import component from 'components/new/pages/missions/duty_mission_archive/_config-data/components';

import { config } from 'components/new/pages/missions/duty_mission_archive/_config-data/registry-config';
import dutyMissionPermissions from '../../duty_mission/_config-data/permissions';

export default {
  path: '/missions/duty_missions_archive',
  routePath: `/missions/duty_missions_archive/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Архив наряд-заданий',
  isNewRegistry: true,
  entyity: 'duty_mission',
  noDotList: false,
  component,
  permissions: dutyMissionPermissions,
};
