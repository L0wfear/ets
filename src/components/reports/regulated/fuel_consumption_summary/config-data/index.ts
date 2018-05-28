import permissions from 'components/reports/regulated/fuel_consumption_summary/config-data/permissions';
import components from 'components/reports/regulated/fuel_consumption_summary/config-data/components';

export default {
  path: '/fuel-consumption-summary-report',
  title: 'Сводный отчет расхода топлива',
  entyity: 'fuel_consumption_summary_report',
  noDotList: false,
  components,
  permissions,
};
