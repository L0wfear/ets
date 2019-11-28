import permissions from 'components/old/reports/regulated/fuel_consumption/config-data/permissions';
import component from 'components/old/reports/regulated/fuel_consumption/config-data/components';

export default {
  path: '/fuel-consumption-report',
  title: 'Отчёт по топливу',
  entyity: 'fuel_consumption_report',

  component,
  permissions,
};
