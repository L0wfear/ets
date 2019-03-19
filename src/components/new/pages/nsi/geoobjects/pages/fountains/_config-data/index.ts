import permissions from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/components';

export default {
  path: '/fountains',
  routePath: '/fountains/:id?',
  title: 'Справочник фонтанов',
  entyity: 'fountains',
  noDotList: false,
  component,
  permissions,
};
