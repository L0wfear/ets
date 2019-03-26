import permissions from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/components';

export default {
  path: '/fueling-water',
  routePath: '/fueling-water/:id?',
  title: 'Справочник баз гидрантов',
  isNewRegistry: true,
  entyity: 'fueling_water',
  noDotList: false,
  component,
  permissions,
};
