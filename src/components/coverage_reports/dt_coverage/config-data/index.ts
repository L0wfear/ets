import permissions from 'components/coverage_reports/dt_coverage/config-data/permissions';
import component from 'components/coverage_reports/dt_coverage/config-data/components';

export default {
  path: '/dt_coverage_report',
  title: 'Отчет по посещению ДТ',
  entyity: 'dt_coverage_report',
  noDotList: true,
  component,
  permissions,
};
