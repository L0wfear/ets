import permissions from 'components/missions/mission_template/config-data/permissions';
import component from 'components/missions/mission_template/config-data/components';

export default {
  path: '/mission-templates-journal',
  title: 'Шаблоны заданий',
  entyity: 'mission_template',
  noDotList: false,
  component,
  permissions,
};
