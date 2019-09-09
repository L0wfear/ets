import permissions from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/components';

import { config } from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/registry-config';

export default {
  path: '/nsi/geoobjects/odh',
  routePath: `/nsi/geoobjects/odh/:${config.list.data.uniqKeyForParams}?`,
  title: 'Справочник ОДХ',
  isNewRegistry: true,
  entyity: 'type',

  component,
  permissions,
};
