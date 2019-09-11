import permissions from 'components/old/monitor/config-data/permissions';
import component from 'components/old/monitor/config-data/components';

export default {
  path: '/monitor',
  routePath: '/monitor/:gov_number?',
  title: 'Карта',
  entyity: 'monitor',

  component,
  permissions,
};
