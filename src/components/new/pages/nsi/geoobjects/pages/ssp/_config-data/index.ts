import permissions from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/components';

export default {
  path: '/ssp',
  routePath: '/ssp/:id?',
  title: 'Справочник ССП',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
