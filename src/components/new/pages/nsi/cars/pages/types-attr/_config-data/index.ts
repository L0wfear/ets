import permissions from 'components/new/pages/nsi/cars/pages/types-attr/_config-data/permissions';
import component from 'components/new/pages/nsi/cars/pages/types-attr/_config-data/components';

export default {
  path: '/types_attr',
  routePath: '/types_attr/:id?',
  title: 'Таблица нормативных скоростей и ширин',
  isNewRegistry: true,
  entyity: 'types_attr',
  noDotList: false,
  component,
  permissions,
};
