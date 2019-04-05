import permissions from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/components';

import { config } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';

export const item = 'car_actual';
export const id = config.list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?/:tabKey?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?/:tabKey?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Реестр транспортных средств',
  isNewRegistry: true,
  entyity: 'car',
  noDotList: false,
  component,
  permissions,
};
