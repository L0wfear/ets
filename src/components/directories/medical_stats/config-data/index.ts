import permissions from 'components/directories/medical_stats/config-data/permissions';
import components from 'components/directories/medical_stats/config-data/components';

export default {
  path: '/medical-stats',
  title: 'Статистика прохождения мед. осмотров',
  entyity: 'medical_stats',
  noDotList: false,
  components,
  permissions,
};
