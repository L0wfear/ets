import permissions from 'components/missions/duty_mission/config-data/permissions';
import components from 'components/missions/duty_mission-archive/config-data/components';

export default {
  path: '/duty-missions-archive-journal',
  title: 'Архив наряд-заданий',
  entyity: 'duty_mission',
  noDotList: false,
  components,
  permissions,
};
