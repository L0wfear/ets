import permissions from 'components/missions/duty_mission/config-data/permissions';
import component from 'components/missions/duty_mission/config-data/components';

export default {
  path: '/duty-missions-journal',
  title: 'Журнал наряд-заданий',
  entyity: 'duty_mission',
  noDotList: false,
  component,
  permissions,
};
