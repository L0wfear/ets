import permissions from 'components/reports/operational/mission_progress/config-data/permissions';
import component from 'components/reports/operational/mission_progress/config-data/components';

export default {
  path: '/mission-progress-report',
  title: 'Отчет посещения ОДХ и ДТ',
  entyity: 'mission_progress_report',
  noDotList: false,
  component,
  permissions,
};
