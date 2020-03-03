import permissions from 'components/old/reports/operational/route_odh_coverage/config-data/permissions';
import component from 'components/old/reports/operational/route_odh_coverage/config-data/components';

export default {
  path: '/route-odh-coverage-report',
  title: 'Покрытие ОДХ маршрутами',
  entyity: 'route_odh_coverage_report',

  hiddenNav: process.env.STAND === 'prod',
  component,
  permissions,
};
