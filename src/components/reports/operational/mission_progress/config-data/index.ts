import permissions from 'components/reports/operational/mission_progress/config-data/permissions';
import components from 'components/reports/operational/mission_progress/config-data/components';

export default {
  path: '/mission-progress-report',
  title: 'Отчет по уборке территорий',
  entyity: 'autobase_long_repair_report',
  noDotList: false,
  components,
  permissions,
};
