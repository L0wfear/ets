import permissions from 'components/old/reports/operational/cars_count_deviation/config-data/permissions';
import component from 'components/old/reports/operational/cars_count_deviation/config-data/components';

export default {
  path: '/cars-count-deviation',
  title: 'Отклонение от нормативного количества ТС',
  entyity: 'cars_count_deviation',

  component,
  permissions,
};
