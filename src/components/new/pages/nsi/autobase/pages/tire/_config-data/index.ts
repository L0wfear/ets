import permissions from 'components/new/pages/nsi/autobase/pages/tire/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/tire/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/tire/_config-data/registry-config';

export const item = 'tire';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Реестр шин',
  isNewRegistry: true,
  entyity: 'autobase_tire',
  noDotList: false,
  component,
  permissions,
};
