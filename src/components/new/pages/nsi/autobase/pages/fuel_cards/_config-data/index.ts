import permissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/components';

import { getToConfig, registryKey } from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/registry-config';
import * as queryString from 'query-string';

export const item = 'fuel_cards';
export const id = getToConfig(null).list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?`;
const filterKey = `${registryKey}_filters`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Реестр топливных карт',
  isNewRegistry: false,
  entyity: 'fuel_cards',
  pathFormMenu: `${path}?${
    queryString.stringify({
      [filterKey]: encodeURIComponent(JSON.stringify({ status_text__in: ['Активна'] })),
    })}`,

  component,
  permissions,
};
