import permissions from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/_config-data/registry-config';

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
  title: 'Реестр метрологических проверок тахографов',
  isNewRegistry: false,
  entyity: 'tachograph_metrological_verification',

  component,
  permissions,
};
