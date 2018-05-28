import permissions from 'components/reports/regulated/cleaning_status_tech_op/config-data/permissions';
import components from 'components/reports/regulated/cleaning_status_tech_op/config-data/components';

export default {
  path: '/cleaning-status-tech-op-report',
  title: 'Статус по выполнению городских заданий',
  entyity: 'cleaning_status_tech_op_report',
  noDotList: false,
  hiddenNav: true,
  components,
  permissions,
};
