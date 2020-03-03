import permissions from 'components/old/reports/regulated/fuel_consumption_summary/config-data/permissions';
import component from 'components/old/reports/regulated/fuel_consumption_summary/config-data/components';

export default {
  path: '/fuel-consumption-summary-report',
  title: 'Сводный отчет расхода топлива',
  entyity: 'fuel_consumption_summary_report',

  hiddenNav: true,
  component,
  permissions,
};
