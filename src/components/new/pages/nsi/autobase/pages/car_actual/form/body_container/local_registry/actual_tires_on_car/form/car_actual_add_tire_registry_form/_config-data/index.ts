import permissions from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/form/car_actual_add_tire_registry_form/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/form/car_actual_add_tire_registry_form/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/actual_tires_on_car/form/car_actual_add_tire_registry_form/_config-data/registry-config';

export const item = 'tire_registry_add_button';
export const id = getToConfig(null, null).list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/autobase/${item}`;
export const routePath = `${path}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Реестр шин',
  isNewRegistry: true,
  entyity: 'autobase_tire',

  component,
  permissions,
};
