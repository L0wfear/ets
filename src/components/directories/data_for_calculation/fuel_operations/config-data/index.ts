import permissions from 'components/directories/data_for_calculation/fuel_operations/config-data/permissions';
import component from 'components/directories/data_for_calculation/fuel_operations/config-data/components';

export default {
  path: '/fuel-operations',
  title: 'Операции для расчета топлива',
  entyity: 'fuel_operation',
  noDotList: false,
  component,
  permissions,
};
