import permissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/permissions';

import component from 'components/new/pages/nsi/autobase/pages/fuel_cards_archive/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/registry-config';

export const item = 'fuel_cards_archive';
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
  title: 'Архив топливных карт',
  isNewRegistry: false,
  entyity: 'fuel_cards_archive',

  component,
  permissions,
};
