import permissions from 'components/old/reports/operational/mission_progress/config-data/permissions';
import component from 'components/old/reports/operational/mission_progress/config-data/components';

export default {
  path: '/mission-progress-report',
  title: 'Отчет посещения ОДХ/ДТ уборочной техникой, оборудованной датчиками КБМ',
  entyity: 'mission_progress_report',

  component,
  permissions,
};
