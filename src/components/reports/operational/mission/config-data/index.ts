import permissions from 'components/reports/operational/mission/config-data/permissions';
import components from 'components/reports/operational/mission/config-data/components';

export default {
  path: '/mission-reports',
  title: 'Прохождение заданий',
  entyity: 'car_travel_report',
  noDotList: false,
  components,
  hiddenNav: true,
  permissions,
};
