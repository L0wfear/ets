import permissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/refill_block/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/refill_block/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/refill_block/_config-data/registry-config';

export const item = 'refill';
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
  title: 'Реестр заправок',
  isNewRegistry: false,
  entyity: 'refill',

  component,
  permissions,
};
