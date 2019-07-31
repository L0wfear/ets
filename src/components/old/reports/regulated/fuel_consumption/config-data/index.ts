import permissions from 'components/old/reports/regulated/fuel_consumption/config-data/permissions';
import component from 'components/old/reports/regulated/fuel_consumption/config-data/components';

export default {
  path: '/fuel-consumption-report',
  title: 'Расход топлива',
  entyity: 'fuel_consumption_report',
  noDotList: false,
  component,
  permissions,
};
