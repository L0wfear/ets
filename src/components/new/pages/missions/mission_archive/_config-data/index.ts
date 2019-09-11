import component from 'components/new/pages/missions/mission_archive/_config-data/components';

import { config } from 'components/new/pages/missions/mission_archive/_config-data/registry-config';
import missionPermissions from '../../mission/_config-data/permissions';

export default {
  path: '/missions/missions_archive',
  routePath: `/missions/missions_archive/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Архив заданий',
  isNewRegistry: true,
  entyity: 'mission',

  component,
  permissions: missionPermissions,
};
