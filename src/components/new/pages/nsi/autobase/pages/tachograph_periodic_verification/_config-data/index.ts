import permissions from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/_config-data/permissions';
import component from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/_config-data/registry-config';

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
  title: 'Реестр периодических поверок тахографов',
  isNewRegistry: false,
  entyity: 'tachograph_periodic_verification',

  component,
  permissions,
};
