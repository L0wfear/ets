import permissions from 'components/new/pages/nsi/employee_on_car/_config-data/permissions';
import component from 'components/new/pages/nsi/employee_on_car/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/employee_on_car/_config-data/registry-config';
import { formPath } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';

export const item = 'employee_on_car';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}${formPath}`;
export const path = `/nsi/${item}`;
export const routePath = `/nsi/${item}${formPath}`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Матрица распределения ТС и водителей',
  isNewRegistry: true,
  entyity: 'employee_on_car',

  component,
  permissions,
};
