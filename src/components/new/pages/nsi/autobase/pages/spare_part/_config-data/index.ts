import permissions from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data/registry-config';

export const item = 'spare_part';
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
  title: 'Реестр запчастей',
  isNewRegistry: true,
  entyity: 'autobase_spare_part',
  noDotList: false,
  component,
  permissions,
};
