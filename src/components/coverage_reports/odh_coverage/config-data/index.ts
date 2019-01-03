import permissions from 'components/coverage_reports/odh_coverage/config-data/permissions';
import component from 'components/coverage_reports/odh_coverage/config-data/components';

export default {
  path: '/odh_coverage_report',
  title: 'Отчет по посещению ОДХ',
  entyity: 'odh_coverage_report',
  noDotList: true,
  component,
  permissions,
};
