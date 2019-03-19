import permissions from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/components';

export default {
  path: '/msp',
  routePath: '/msp/:id?',
  title: 'Справочник МСП',
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
