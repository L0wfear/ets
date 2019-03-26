import permissions from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/components';

export default {
  path: '/carpool',
  routePath: '/carpool/:id?',
  isNewRegistry: true,
  title: 'Справочник Автобаз',
  entyity: 'carpool',
  noDotList: false,
  component,
  permissions,
};
