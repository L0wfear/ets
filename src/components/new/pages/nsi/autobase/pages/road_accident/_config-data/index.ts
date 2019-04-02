import permissions from 'components/new/pages/nsi/autobase/pages/road_accident/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/road_accident/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/road_accident/_config-data/registry-config';

export const item = 'road_accident';
export const id = getToConfig().list.data.uniqKeyForParams;
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
  isNewRegistry: true,
  entyity: 'autobase_road_accident',
  noDotList: false,
  component,
  permissions,
};
