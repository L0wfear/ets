import permissions from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/fueling_water',
  routePath: `/nsi/geoobjects/fueling_water/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник баз гидрантов',
  isNewRegistry: true,
  entyity: 'fueling_water',

  component,
  permissions,
};
