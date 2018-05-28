import permissions from 'components/reports/regulated/fuel_consumption/config-data/permissions';
import components from 'components/reports/regulated/fuel_consumption/config-data/components';

export default {
  path: '/fuel-consumption-report',
  title: 'Расход топлива',
  entyity: 'fuel_consumption_report',
  noDotList: false,
  components,
  permissions,
};
