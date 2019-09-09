import permissions from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/components';

import { config } from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/registry-config';

export const item = 'types_attr';
export const id = config.list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Таблица нормативных скоростей и ширин',
  isNewRegistry: true,
  entyity: 'types_attr',

  component,
  permissions,
};
