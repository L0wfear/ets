import permissions from 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/_config-data/permissions';
import component from 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/_config-data/registry-config';

export const item = 'odh_norm_data_summer';
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
  title: 'Показатели норм по содержанию ОДХ (лето)',
  isNewRegistry: true,
  entyity: 'odh_norm_data_summer',
  noDotList: false,
  component,
  permissions,
};
