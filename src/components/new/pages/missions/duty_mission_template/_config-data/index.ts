import component from 'components/new/pages/missions/duty_mission_template/_config-data/components';
import permissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';

export default {
  path: '/missions/duty_mission_templates',
  routePath: '/missions/duty_mission_templates/:id?/:type?',
  title: 'Шаблоны наряд-заданий',
  isNewRegistry: true,
  entyity: 'duty_mission-template',
  noDotList: false,
  component,
  permissions,
};
