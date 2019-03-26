import permissions from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/components';

export default {
  path: '/odh',
  routePath: '/odh/:id?',
  title: 'Справочник ОДХ',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
