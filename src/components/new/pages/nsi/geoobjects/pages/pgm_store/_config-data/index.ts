import permissions from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/registry-config';

export default {
  path: '/pgm_store',
  routePath: `/pgm_store/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник пунктов отпуска ПГМ',
  isNewRegistry: true,
  entyity: 'pgm',
  noDotList: false,
  component,
  permissions,
};
