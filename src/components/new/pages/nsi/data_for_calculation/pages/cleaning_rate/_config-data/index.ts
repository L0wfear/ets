import permissions from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/permissions';
import component from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/registry-config';

export const item = 'cleaning_rate';
export const id = getToConfig('odh').list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:selected_odh_dt_value?/:${id}?`;
export const path = `/nsi/data_for_calculation/${item}`;
export const routePath = `/nsi/data_for_calculation/${item}/:selected_odh_dt_value?/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Показатели для расчета эффективности работы бригад',
  isNewRegistry: true,
  entyity: 'cleaning_rate',

  component,
  permissions,
};
