import permissions from 'components/old/reports/operational/car_downtime_and_overmileage/config-data/permissions';
import component from 'components/old/reports/operational/car_downtime_and_overmileage/config-data/components';

export default {
  path: '/car-downtime-and-overmileage-report',
  title: 'Простои и перепробеги ТС',
  entyity: 'car_downtime_and_overmileage_report',

  component,
  permissions,
};
