import permissions from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/_config-data/permissions';
import component from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/_config-data/registry-config';

export const item = 'maintenance_work';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/data_for_calculation/${item}`;
export const routePath = `/nsi/data_for_calculation/${item}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Показатели регламентных работ',
  isNewRegistry: true,
  entyity: 'maintenance_work',
  noDotList: false,
  component,
  permissions,
};
