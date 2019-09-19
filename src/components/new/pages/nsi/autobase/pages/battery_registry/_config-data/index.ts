import permissions from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data/registry-config';

export const item = 'battery_registry';
export const id = getToConfig(null).list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Реестр аккумуляторов',
  isNewRegistry: false,
  entyity: 'autobase_battery',

  component,
  permissions,
};
