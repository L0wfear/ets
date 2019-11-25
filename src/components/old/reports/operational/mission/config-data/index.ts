import permissions from 'components/old/reports/operational/mission/config-data/permissions';
import component from 'components/old/reports/operational/mission/config-data/components';

export default {
  path: '/mission-reports',
  title: 'Отчет по прохождению заданий',
  entyity: 'car_travel_report',

  component,
  permissions,
};
