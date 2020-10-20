import permissions from 'components/new/pages/nsi/autobase/pages/tachograph/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/tachograph/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/tachograph/_config-data/registry-config';

export const item = 'tachograph';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?/:tabKey?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Реестр тахографов',
  isNewRegistry: false,
  entyity: 'tachograph',

  component,
  permissions,
};
