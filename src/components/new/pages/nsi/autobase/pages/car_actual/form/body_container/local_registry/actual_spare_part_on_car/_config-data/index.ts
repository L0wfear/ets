import permissions from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_spare_part_on_car/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_spare_part_on_car/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_spare_part_on_car/_config-data/registry-config';

export const item = 'sparePart';
export const id = getToConfig(0).list.data.uniqKeyForParams;
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
  isNewRegistry: false,
  entyity: 'autobasespare_part',

  component,
  permissions,
};
