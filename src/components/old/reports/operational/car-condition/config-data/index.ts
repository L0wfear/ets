import permissions from 'components/old/reports/operational/car-condition/config-data/permissions';
import component from 'components/old/reports/operational/car-condition/config-data/components';

export default {
  path: '/car-condition-reports',
  title: 'Количество ТС в разрезе технического состояния',
  entyity: 'car_condition_report',
  noDotList: false,
  component,
  permissions,
};
