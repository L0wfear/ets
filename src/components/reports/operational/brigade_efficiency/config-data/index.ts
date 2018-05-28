import permissions from 'components/reports/operational/brigade_efficiency/config-data/permissions';
import components from 'components/reports/operational/brigade_efficiency/config-data/components';

export default {
  path: '/brigade-efficiency-report',
  title: 'Работа бригад по ручной уборке',
  entyity: 'brigade_efficiency_report',
  noDotList: false,
  components,
  permissions,
};
