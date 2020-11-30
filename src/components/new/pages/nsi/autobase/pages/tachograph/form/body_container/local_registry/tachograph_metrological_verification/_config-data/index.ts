import permissions from './permissions';
import component from './components';

import { getToConfig } from './registry-config';

export const item = 'tachograph_metrological_verification';
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
  title: 'Реестр метрологических проверок данного тахографа',
  isNewRegistry: false,
  entyity: 'tachograph_metrological_verification',

  component,
  permissions,
};
