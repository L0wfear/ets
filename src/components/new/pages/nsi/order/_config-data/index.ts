import permissions from 'components/new/pages/nsi/order/_config-data/permissions';
import component from 'components/new/pages/nsi/order/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/order/_config-data/registry-config';

export const id = getToConfig().list.data.uniqKeyForParams;
export const item = 'orders';
export const path = `/nsi/${item}`;
export const routePath = `/nsi/${item}/:${id}?/:type?`;

export default {
  item,
  path,
  routePath,
  title: 'Реестр централизованных заданий',
  isNewRegistry: false,
  entyity: 'faxogramm',

  component,
  permissions,
};
