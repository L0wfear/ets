import permissions from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data/permissions';
import component from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data/registry-config';

export const item = 'fuel_operations';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/data_for_calculation/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Операции для расчета топлива',
  isNewRegistry: true,
  entyity: 'fuel_operation',

  component,
  permissions,
};
