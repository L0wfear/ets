import permissions from 'components/missions/duty_mission_template/config-data/permissions';
import component from 'components/missions/duty_mission_template/config-data/components';

export default {
  path: '/duty-mission-templates-journal',
  title: 'Шаблоны наряд-заданий',
  entyity: 'duty_mission-template',
  noDotList: false,
  component,
  permissions,
};
