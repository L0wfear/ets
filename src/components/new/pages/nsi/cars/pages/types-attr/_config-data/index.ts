import permissions from 'components/new/pages/nsi/cars/pages/types-attr/_config-data/permissions';
import component from 'components/new/pages/nsi/cars/pages/types-attr/_config-data/components';

export default {
  path: '/types-attr',
  routePath: '/types-attr/:id?',
  title: 'Таблица нормативных скоростей и ширин',
  entyity: 'types_attr',
  noDotList: false,
  component,
  permissions,
};
