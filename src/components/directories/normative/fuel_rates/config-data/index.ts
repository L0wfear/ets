import permissions from 'components/directories/normative/fuel_rates/config-data/permissions';
import component from 'components/directories/normative/fuel_rates/config-data/components';

export default {
  path: '/fuel-rates',
  title: 'Нормы расхода топлива',
  entyity: 'fuel_consumption_rate',
  noDotList: false,
  component,
  permissions,
};
