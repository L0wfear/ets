import permissions from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/pgm_store',
  routePath: `/nsi/geoobjects/pgm_store/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник пунктов отпуска ПГМ',
  isNewRegistry: true,
  entyity: 'pgm',

  component,
  permissions,
};
