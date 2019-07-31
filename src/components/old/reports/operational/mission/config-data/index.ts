import permissions from 'components/reports/operational/mission/config-data/permissions';
import component from 'components/reports/operational/mission/config-data/components';

export default {
  path: '/mission-reports',
  title: 'Прохождение заданий',
  entyity: 'car_travel_report',
  noDotList: false,
  component,
  permissions,
};
