import permissions from 'components/reports/operational/deviation_from_norm_of_cars/config-data/permissions';
import components from 'components/reports/operational/deviation_from_norm_of_cars/config-data/components';

export default {
  path: '/deviation-from-norm-of-cars',
  title: 'Отклонение от нормативного количества ТС',
  entyity: 'deviation_from_norm_of_cars',
  noDotList: false,
  components,
  permissions,
};
