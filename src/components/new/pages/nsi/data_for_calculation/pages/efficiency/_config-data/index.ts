import permissions from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/_config-data/permissions';
import component from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/_config-data/registry-config';

export const item = 'efficiency';
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
  title: 'Показатели для расчета эффективности',
  isNewRegistry: true,
  entyity: 'efficiency',
  noDotList: false,
  component,
  permissions,
};
