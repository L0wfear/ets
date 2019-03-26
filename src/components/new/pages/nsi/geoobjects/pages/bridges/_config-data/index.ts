import permissions from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/components';

export default {
  path: '/bridges',
  routePath: '/bridges/:id?',
  title: 'Справочник мостов',
  isNewRegistry: true,
  entyity: 'bridges',
  noDotList: false,
  component,
  permissions,
};
