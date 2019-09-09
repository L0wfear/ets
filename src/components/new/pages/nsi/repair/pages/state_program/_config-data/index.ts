import permissions from 'components/new/pages/nsi/repair/pages/state_program/_config-data/permissions';
import component from 'components/new/pages/nsi/repair/pages/state_program/_config-data/components';

import { getToConfig } from 'components/new/pages/nsi/repair/pages/state_program/_config-data/registry-config';

export const item = 'state_program';
export const id = getToConfig().list.data.uniqKeyForParams;
export const patrialEndPath = `/${item}/:${id}?`;
export const path = `/nsi/repair/${item}`;
export const routePath = `/nsi/repair/${item}/:${id}?`;

export default {
  item,
  id,
  patrialEndPath,
  path,
  routePath,
  title: 'Справочник государственных программ ремонта',
  isNewRegistry: true,
  entyity: 'repair_state_program',

  component,
  permissions,
};
