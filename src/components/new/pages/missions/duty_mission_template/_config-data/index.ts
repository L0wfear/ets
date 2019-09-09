import component from 'components/new/pages/missions/duty_mission_template/_config-data/components';
import permissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';

import { config } from 'components/new/pages/missions/duty_mission_template/_config-data/registry-config';
import { ConfigPageData } from 'components/@next/@types/config_data';

const missions_duty_mission_templates_page_config: ConfigPageData = {
  path: '/missions/duty_mission_templates',
  routePath: `/missions/duty_mission_templates/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Шаблоны наряд-заданий',
  isNewRegistry: true,
  entyity: 'duty_mission-template',

  component,
  permissions,
};

export default missions_duty_mission_templates_page_config;
