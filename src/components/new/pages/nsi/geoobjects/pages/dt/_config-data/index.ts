import permissions from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/components';

export default {
  path: '/dt',
  routePath: '/dt/:yard_id?',
  title: 'Справочник ДТ',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
