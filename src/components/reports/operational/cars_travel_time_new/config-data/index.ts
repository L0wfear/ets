import permissions from 'components/reports/operational/cars_travel_time_new/config-data/permissions';
import component from 'components/reports/operational/cars_travel_time_new/config-data/components';

export default {
  path: '/cars_travel_time_new',
  title: 'Время движения ТС по заданиям(новый)',
  entyity: 'cars_travel_time_new',
  noDotList: false,
  component,
  permissions,
};
