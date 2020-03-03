import component from 'components/new/pages/missions/duty_mission_archive/_config-data/components';

import { config } from 'components/new/pages/missions/duty_mission_archive/_config-data/registry-config';
import dutyMissionPermissions from '../../duty_mission/_config-data/permissions';
import { ConfigPageData } from 'components/@next/@types/config_data';

const missions_duty_missions_archive_page_config: ConfigPageData = {
  path: '/missions/duty_missions_archive',
  routePath: `/missions/duty_missions_archive/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Архив наряд-заданий',
  isNewRegistry: false,
  entyity: 'duty_mission',

  component,
  permissions: dutyMissionPermissions,
};
export default missions_duty_missions_archive_page_config;
