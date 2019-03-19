import permissions from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/permissions';
import component from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/components';

export default {
  path: '/pgm_store',
  routePath: '/pgm_store/:id?',
  title: 'Справочник пунктов отпуска ПГМ',
  entyity: 'pgm',
  noDotList: false,
  component,
  permissions,
};
