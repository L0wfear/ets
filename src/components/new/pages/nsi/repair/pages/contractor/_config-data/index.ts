import permissions from 'components/new/pages/nsi/repair/pages/contractor/_config-data/permissions';
import component from 'components/new/pages/nsi/repair/pages/contractor/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/repair/pages/contractor/_config-data/registry-config';

export const item = 'contractor';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/repair/${item}`;
export const routePath = `/nsi/repair/${item}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Справочник подрядчиков',
  isNewRegistry: true,
  entyity: 'repair_contractor',
  noDotList: false,
  component,
  permissions,
};
