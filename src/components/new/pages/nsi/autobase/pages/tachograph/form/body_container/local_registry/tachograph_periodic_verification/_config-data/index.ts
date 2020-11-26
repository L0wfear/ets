import permissions from './permissions';
import component from './components';

import { getToConfig } from './registry-config';

export const item = 'tachograph_periodic_verification';
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
  title: 'Реестр периодических поверок данного тахографа',
  isNewRegistry: false,
  entyity: 'tachograph_periodic_verification',

  component,
  permissions,
};
