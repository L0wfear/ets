import permissions from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/_config-data/permissions';
import component from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_area_rate/_config-data/registry-config';

export const item = 'cleaning_area_rate';
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
  title: 'Коэффициенты площади уборки',
  isNewRegistry: true,
  entyity: 'cleaning_area_rate',

  component,
  permissions,
};
