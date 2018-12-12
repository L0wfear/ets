import permissions from 'components/reports/operational/cars_count_deviation/config-data/permissions';
import components from 'components/reports/operational/cars_count_deviation/config-data/components';

export default {
  path: '/cars-count-deviation',
  title: 'Отклонение от нормативного количества ТС',
  entyity: 'cars_count_deviation',
  noDotList: false,
  components,
  permissions,
};
