import permissions from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data/registry-config';

export const item = 'battery_brand';
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
  title: 'Марки аккумуляторов',
  isNewRegistry: true,
  entyity: 'autobase_battery_brand',

  component,
  permissions,
};
