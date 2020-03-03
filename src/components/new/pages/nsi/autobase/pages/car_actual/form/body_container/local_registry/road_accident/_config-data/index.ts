import permissions from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/_config-data/registry-config';

export const item = 'road_accident';
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
  hiddenNav: true,
  title: 'Реестр ДТП',
  isNewRegistry: false,
  entyity: 'autobase_road_accident',

  component,
  permissions,
};
