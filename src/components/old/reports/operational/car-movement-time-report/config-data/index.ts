import permissions from 'components/reports/operational/car-movement-time-report/config-data/permissions';
import component from 'components/reports/operational/car-movement-time-report/config-data/components';

export default {
  path: '/car-movement-time-report',
  title: 'Время движения ТС',
  entyity: 'car_movement_time_report',
  noDotList: false,
  component,
  permissions,
};
