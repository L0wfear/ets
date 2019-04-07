import permissions from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/_config-data/permissions';
import component from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/_config-data/registry-config';

export const item = 'material_consumption_rate';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/regulatory_indicator/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Нормы на расход расходных материалов',
  isNewRegistry: true,
  entyity: 'material_consumption_rate',
  noDotList: false,
  component,
  permissions,
};
