import permissions from 'components/reports/operational/car_downtime_and_overmileage/config-data/permissions';
import components from 'components/reports/operational/car_downtime_and_overmileage/config-data/components';

export default {
  path: '/car-downtime-and-overmileage-report',
  title: 'Простои и перепробеги ТС при выполнении заданий',
  entyity: 'car_downtime_and_overmileage_report',
  noDotList: false,
  components,
  permissions,
};
