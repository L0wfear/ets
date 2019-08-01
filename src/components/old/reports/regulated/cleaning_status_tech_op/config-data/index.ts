import permissions from 'components/old/reports/regulated/cleaning_status_tech_op/config-data/permissions';
import component from 'components/old/reports/regulated/cleaning_status_tech_op/config-data/components';

export default {
  path: '/cleaning-status-tech-op-report',
  title: 'Статус по выполнению городских заданий',
  entyity: 'cleaning_status_tech_op_report',
  noDotList: false,
  hiddenNav: true,
  component,
  permissions,
};
