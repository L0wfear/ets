import permissions from 'components/directories/data_for_calculation/cleaning_rate/config-data/permissions';
import component from 'components/directories/data_for_calculation/cleaning_rate/config-data/components';

export default {
  path: '/cleaning-rate',
  title: 'Показатели для расчета эффективности работы бригад',
  entyity: 'cleaning_rate',
  noDotList: false,
  component,
  permissions,
};
