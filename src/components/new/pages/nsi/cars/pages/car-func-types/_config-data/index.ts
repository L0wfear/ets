import permissions from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data/permissions';
import component from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data/components';

export default {
  path: '/car-func-types',
  routePath: '/car-func-types/:asuods_id?',
  title: 'Типы техники',
  isNewRegistry: true,
  entyity: 'type',
  noDotList: false,
  component,
  permissions,
};
