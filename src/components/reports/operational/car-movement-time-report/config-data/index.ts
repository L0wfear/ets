import permissions from 'components/reports/operational/car-movement-time-report/config-data/permissions';
import components from 'components/reports/operational/car-movement-time-report/config-data/components';

export default {
  path: '/car-movement-time-report',
  title: 'Время движения ТС',
  entyity: 'car_movement_time_report',
  noDotList: false,
  components,
  permissions,
};
