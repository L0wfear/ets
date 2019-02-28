import permissions from 'components/reports/operational/cars_travel_time/config-data/permissions';
import component from 'components/reports/operational/cars_travel_time/config-data/components';

export default {
  path: '/cars_travel_time',
  title: 'Время движения ТС по заданиям',
  entyity: 'cars_travel_time',
  noDotList: false,
  component,
  permissions,
};
