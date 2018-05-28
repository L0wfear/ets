import permissions from 'components/reports/operational/route_odh_coverage/config-data/permissions';
import components from 'components/reports/operational/route_odh_coverage/config-data/components';

export default {
  path: '/route-odh-coverage-report',
  title: 'Покрытие ОДХ маршрутами',
  entyity: 'route_odh_coverage_report',
  noDotList: false,
  components,
  permissions,
};
