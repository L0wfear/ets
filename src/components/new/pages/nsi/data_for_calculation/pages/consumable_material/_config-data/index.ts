import permissions from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/_config-data/permissions';
import component from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/_config-data/registry-config';

export const item = 'consumable_material';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/data_for_calculation/${item}/odh`;
export const routePath = `/nsi/data_for_calculation/${item}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Расходные материалы',
  isNewRegistry: true,
  entyity: 'odh_norm',
  noDotList: false,
  component,
  permissions,
};
