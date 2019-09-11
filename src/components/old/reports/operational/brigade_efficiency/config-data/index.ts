import permissions from 'components/old/reports/operational/brigade_efficiency/config-data/permissions';
import component from 'components/old/reports/operational/brigade_efficiency/config-data/components';

export default {
  path: '/brigade-efficiency-report',
  title: 'Работа бригад по ручной уборке',
  entyity: 'brigade_efficiency_report',

  component,
  permissions,
};
